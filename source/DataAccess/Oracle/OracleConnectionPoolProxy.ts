import * as oracledb from 'oracledb';
import { inject, injectable } from 'inversify';
import TYPES from '../../../ioc.types';
import { Logger } from 'winston';
import IConnectionPool from '../IConnectionPool';

let POOL_SIZE = 5;
if (process.env.CONCURRENT_CONNECTIONS) {
    POOL_SIZE = Number(process.env.CONCURRENT_CONNECTIONS);
}

/**
 * A proxy class brokering Oracle Connections from an oracledb.IConnectionPool instance.
 *
 * @export
 * @class OracleConnectionPoolProxy
 * @implements {IConnectionPool}
 */
@injectable()
export default class OracleConnectionPoolProxy implements IConnectionPool {
    private _logger: Logger;
    private _connectionPool: oracledb.IConnectionPool;

    constructor(
        @inject(TYPES.Logger) logger: Logger) {
        this._logger = logger;
    }

    public async open(): Promise<void> {
        if (process.env.ORACLE_ENDPOINT === undefined) {
            return;
        }
        this._connectionPool = await (oracledb as any).createPool({
            connectString : process.env.ORACLE_ENDPOINT,
            password      : process.env.ORACLE_PASSWORD,
            poolMax       : POOL_SIZE,
            queueTimeout  : 60000,
            user          : process.env.ORACLE_USER
        });
        return Promise.resolve();
    }

    public async close(): Promise<void> {
        if (this._connectionPool) {
            try {
                // See https://github.com/oracle/node-oracledb/blob/master/doc/api.md#poolclose
                // Supply a draintime so that we can ensure the call will succeed
                await (this._connectionPool as any).close(30);
                return Promise.resolve();
            } catch (err) {
                this._logger.error(err);
                return Promise.reject(err);
            }
        }
    }

    public async getConnection(): Promise<any> {
        this._logger.silly('Connections in use: ' + this._connectionPool.connectionsInUse);
        this._logger.silly('Connections open: ' + this._connectionPool.connectionsOpen);
        this._logger.silly('Queue requests: ' + this._connectionPool.queueRequests);
        return await this._connectionPool.getConnection();
    }

    public async releaseConnection(connection: any) {
        // See https://github.com/oracle/node-oracledb/blob/master/doc/api.md#connpooling
        // Calling close on the connection after use is the designed way to release
        // the connection back into the pool
        this._logger.silly('Releasing Connection');
        try {
        await (connection as oracledb.IConnection).close();
        } catch (err) {
            this._logger.error(err.stack);
        }
        return Promise.resolve();
    }
}
