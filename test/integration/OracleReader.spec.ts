// tslint:disable:no-conditional-assignment

import container from '../unit/test.inversify.config';
import OracleReader from '../../source/DataAccess/Oracle/OracleReader';
import TYPES from '../../ioc.types';
import { Logger } from 'winston';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import OracleConnectionPoolProxy from '../../source/DataAccess/Oracle/OracleConnectionPoolProxy';
import { IQueryResult } from '../../source/DataAccess/IDataReader';
import OracleDDLHelper from '../../source/DataAccess/Oracle/OracleDDLHelper';

const expect = chai.expect;

describe('oracledb', () => {

    describe('When connecting to an Oracle database', () => {
        it('should return sample query results', async () => {
            const logger = container.get<Logger>(TYPES.Logger);
            const pool = new OracleConnectionPoolProxy(logger);
            const reader = new OracleReader(logger, pool);

            await pool.open();

            const queryResult: IQueryResult = await reader.read({ name: 'ALL_TABLES', query: 'SELECT * FROM ALL_TABLES' });
            expect(queryResult.result.readable).to.be.equal(true);
            expect(queryResult.metadata.readable).to.be.equal(true);

            let chunk;
            let output = '';
            while ((chunk = queryResult.result.read()) !== null) {
                output += chunk.toString();
            }

            while ((chunk = queryResult.metadata.read()) !== null) {
                output += chunk.toString();
            }

            await reader.close();
            await pool.close();
        });

        it('should throw an exception when attempting to query a table that does not exist', async () => {
            const logger = container.get<Logger>(TYPES.Logger);
            const pool = new OracleConnectionPoolProxy(logger);
            const reader = new OracleReader(logger, pool);

            await pool.open();

            const readPromise = reader.read({ name: 'tableONE', query: 'SELECT * FROM tableDNE' });

            expect(readPromise).to.eventually.be.rejectedWith(Error);

            await reader.close();
            await pool.close();
        });
    });
});
