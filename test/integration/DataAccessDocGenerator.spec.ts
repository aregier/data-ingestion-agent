import 'reflect-metadata';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as fs from 'fs';

import { IntegrationType } from '../../source/IIntegrationConfig';
import DataAccessDocGenerator from '../../source/DataAccess/DataAccessDocGenerator';

const expect = chai.expect;

const integrationTypeKeys = Object.keys(IntegrationType).slice(0, -2);

describe('DataAccessDocGenerator', () => {

    describe('DataAccessDoc', () => {

        let sandbox: sinon.SinonSandbox;
        let dad;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('Should successfully write file for each integration type', () => {
            integrationTypeKeys.forEach(async (key) => {
                if (fs.existsSync(`./docs/DataAccess/${IntegrationType[key]}.md`)) {
                    fs.unlinkSync(`./docs/DataAccess/${IntegrationType[key]}.md`);
                }
                expect(fs.existsSync(`./docs/DataAccess/${IntegrationType[key]}.md`)).to.be.false;
                dad = new DataAccessDocGenerator(IntegrationType[key]);
                await dad.create();
                expect(fs.existsSync(`./docs/DataAccess/${IntegrationType[key]}.md`)).to.be.true;
            });
        });

        it('Should should throw an error for unknown integration types', () => {
            expect(() => { new DataAccessDocGenerator(IntegrationType.Unknown); }).to.throw;
        });

    });

});
