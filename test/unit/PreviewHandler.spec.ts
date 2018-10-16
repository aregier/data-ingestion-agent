
import "reflect-metadata";
import * as chai from 'chai';
import container from './test.inversify.config';
import TYPES from '../../ioc.types';

import IMessage from '../../source/IMessage';
import IIngestionReader from "../../source/DataAccess/IDataReader";
import * as sinon from "sinon";
import { Logger, loggers } from "winston";
import PreviewMessage from "../../source/Messages/PreviewMessage";
import PreviewHandler from "../../source/MessageHandlers/PreviewHandler";

const expect = chai.expect;

describe('PreviewHandler', () => {

    describe('when handling a message', () => {

        it('should successfully return after handling a message', async () => {
            const message: IMessage = PreviewMessage.create({}, "1234");

            var logger = container.get<Logger>(TYPES.Logger);
            var reader = container.get<IIngestionReader>(TYPES.IngestionReader);

            var loggerSpy = sinon.spy(logger, "log");
            var readerLogQuerySpy = sinon.spy(reader, "logQueries");
            var readerReadSpy = sinon.spy(reader, "read");

            var handler = new PreviewHandler(reader, logger);
            await handler.handle(message);

            expect(loggerSpy.callCount).to.be.greaterThan(1);
            expect(readerLogQuerySpy.callCount).to.eq(1);
            expect(readerReadSpy.callCount).to.eq(0);

        });
    });
});