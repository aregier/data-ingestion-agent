
import 'reflect-metadata';
import * as chai from 'chai';
import container from './test.inversify.config';
import TYPES from '../../ioc.types';

import IMessage from '../../source/IMessage';
import SendDataMessage from '../../source/Messages/SendDataMessage';
import SendDataHandler from '../../source/MessageHandlers/SendDataHandler';
import IIngestionReader from '../../source/DataAccess/IDataReader';
import IIngestionWriter from '../../source/DataAccess/IDataWriter';
import * as sinon from 'sinon';
import { Logger } from 'winston';

const expect = chai.expect;

describe('SendDataHandler', () => {

    describe('when handling a message', () => {

        it('should successfully return after handling a message', async () => {
            const message: IMessage = SendDataMessage.create({}, '1234');

            const logger = container.get<Logger>(TYPES.Logger);
            const reader = container.get<IIngestionReader>(TYPES.IngestionReader);
            const writer = container.get<IIngestionWriter>(TYPES.IngestionWriter);

            const readerLogQuerySpy = sinon.spy(reader, 'logQueries');
            const readerReadSpy = sinon.spy(reader, 'read');
            const writerSpy = sinon.spy(writer, 'ingest');

            const handler = new SendDataHandler(reader, writer, logger);
            await handler.handle(message);

            expect(readerLogQuerySpy.callCount).to.eq(0);
            expect(readerReadSpy.callCount).to.eq(1);
            expect(writerSpy.callCount).to.eq(1);
        });
    });
});
