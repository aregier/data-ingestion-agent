import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import IMessageHandler from '@source/IMessageHandler';
import DummyMessage from '@Messages/DummyMessage';

@injectable()
export default class DummyHandler implements IMessageHandler {

    public async handle(message: DummyMessage) {
        return Promise.resolve();
    }
}
