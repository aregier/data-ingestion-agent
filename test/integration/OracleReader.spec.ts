import container from '../unit/test.inversify.config';
import OracleReader from "../../source/DataAccess/Oracle/OracleReader";
import TYPES from '../../ioc.types';
import { Logger } from "winston";

import * as chai from 'chai';
import * as oracledb from 'oracledb';
import { Readable } from 'stream';

const expect = chai.expect;
const should = chai.should();

describe('oracledb', () => {

    describe('When connecting to an Oracle database', () => {
        it('should return sample query results', async () => {
            var logger = container.get<Logger>(TYPES.Logger);
            let reader = new OracleReader(logger);
            let stream: Readable = await reader.read();
            expect(stream.readable).to.be.equal(true);
            // expect(stream.readableLength).to.be.greaterThan(0);
        });
    });
});
