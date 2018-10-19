import container from '../unit/test.inversify.config';
import OracleReader from '../../source/DataAccess/Oracle/OracleReader';
import TYPES from '../../ioc.types';
import { Logger } from 'winston';

import * as chai from 'chai';
import * as oracledb from 'oracledb';
import { Readable } from 'stream';

const expect = chai.expect;
const should = chai.should();

describe('oracledb', () => {

    describe('When connecting to an Oracle database', () => {
        it('should return sample query results', async () => {
            const logger = container.get<Logger>(TYPES.Logger);
            const reader = new OracleReader(logger);
            await reader.open();
            const stream: Readable = await reader.read('SELECT * FROM ALL_TABLES');
            expect(stream.readable).to.be.equal(true);
            let chunk;
            let output = '';
            // tslint:disable-next-line:no-conditional-assignment
            while ((chunk = stream.read()) !== null) {
                output += chunk.toString();
            }
            await reader.close();
        });
    });
});
