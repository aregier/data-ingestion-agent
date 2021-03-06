import startup from './inversify.config';
import TYPES from './ioc.types';
import { Agent } from './source/Agent';
import fetch from 'fetch-with-proxy';
import { Container } from 'inversify';
// tslint:disable-next-line:no-string-literal
global['fetch'] = fetch;

(async () => {
    let container: Container;
    try {
        container = await startup();
    } catch (error) {
        console.log(error);
    }

    return container;
})()
.then(async (container) => {
    if (container) {
        const agent: Agent = container.get<Agent>(TYPES.Agent);
        await agent.main();
    }
});
