import 'reflect-metadata';
import * as chai from 'chai';

import { Readable } from 'stream';
import sinon = require('sinon');
import { stubInterface } from 'ts-sinon';
import OracleReader from '../../source/DataAccess/Oracle/OracleReader';
import container from './test.inversify.config';
import { Logger } from 'winston';
import TYPES from '../../ioc.types';
import IConnectionPool from '../../source/DataAccess/IConnectionPool';
import oracledb = require('oracledb');

const expect = chai.expect;

describe('OracleReader', () => {
    describe('when ingesting data', () => {
        let sandbox: sinon.SinonSandbox;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should return a stream representing the dataset', async () => {
            process.env.ORACLE_ENDPOINT = 'something';

            // stub connection
            const queryStreamSpy = sandbox.spy(async (query, binds, options) => {
                const resultStream = new Readable({objectMode: true });
                resultStream.push({ col1: 'value', col2: 'value'});
                resultStream.push(null);
                return Promise.resolve(resultStream);
            });
            const closeConnectionSpy = sandbox.spy(async () => {
                return Promise.resolve();
            });

            // const mockConnection = stubInterface<oracledb.IConnection>();
            // const queryStreamStub = (mockConnection.queryStream as sinon.SinonStub);
            // queryStreamStub.callsFake(sandbox.spy(async (query, binds, options) => {
            //     const resultStream = new Readable({objectMode: true });
            //     resultStream.push({ col1: 'value', col2: 'value'});
            //     resultStream.push(null);
            //     return Promise.resolve(resultStream);
            // }));
            // const closeConnectionStub = (mockConnection.close as sinon.SinonStub);

            // stub connection pool
            const mockPool = stubInterface<IConnectionPool>();
            const getConnectionStub = (mockPool.getConnection as sinon.SinonStub);
            getConnectionStub.returns({ close: closeConnectionSpy, queryStream: queryStreamSpy });
            // getConnectionStub.callsFake(sandbox.spy(async () => {
            //     return Promise.resolve(mockConnection);
            // }));
            const releaseConnectionStub = (mockPool.releaseConnection as sinon.SinonStub);
            releaseConnectionStub.callsFake(sandbox.spy(async (connection: any) => {
                await connection.close();
                return Promise.resolve();
            }));

            const logger: Logger = container.get<Logger>(TYPES.Logger);
            const oracleReader: OracleReader = new OracleReader(logger, mockPool);

            // expected use sequence for OracleReader
            await mockPool.open();

            const readable: Readable = await oracleReader.read('Mock query statement');
            await oracleReader.close();

            await mockPool.close();

            expect(getConnectionStub.calledOnce).to.be.true;
            expect(queryStreamSpy.calledOnce).to.be.true;
            expect(releaseConnectionStub.calledOnce).to.be.true;
            expect(closeConnectionSpy.calledOnce).to.be.true;
            expect(readable).to.be.not.null;

            delete process.env.ORACLE_ENDPOINT;
        });

        it('should not attempt to connect to Oracle when generating demo data', async () => {
            const poolStub = stubInterface<IConnectionPool>();

            const logger: Logger = container.get<Logger>(TYPES.Logger);
            const oracleReader: OracleReader = new OracleReader(logger, poolStub);
            const closeSpy = sandbox.spy(oracleReader, 'close');

            const readable: Readable = await oracleReader.read('Mock query statement');
            await oracleReader.close();
            expect(closeSpy.calledOnce).to.be.true;
            expect(readable).to.be.not.null;
        });
    });
});
