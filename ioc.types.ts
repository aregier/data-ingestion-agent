import MessageHandlerFactory from './source/MessageHandlerFactory';

const TYPES = {
    SendDataHandler: Symbol('SendDataHandler'),
    S3Config: Symbol('S3Config'),
    SQSConfig: Symbol('SQSConfig'),
    Logger: Symbol('Logger'),
    TenantId: Symbol('TenantId'),
    QueueUrl: Symbol('QueueUrl'),
    AuthManager: Symbol('AuthService'),
    Container: Symbol('Container'),
    MessageHandlerFactory: Symbol('MessageHandlerFactory'),
    Bucket: Symbol('Bucket'),
    MessageFactory: Symbol('MessageFactory'),
    SendDataMessage: Symbol('SendDataMessage'),
    IngestionReader: Symbol('IngestionReader'),
    IngestionWriter: Symbol('IngestionWriter'),
    DummyHandler: Symbol('DummyHandler'),
    DummyMessage: Symbol('DummyMessage'),
    PreviewMessage: Symbol('PreviewMessage'),
    PreviewHandler: Symbol('PreviewHandler'),

    // Commands
    PREVIEW: Symbol('Preview'),
    INGEST: Symbol('Ingest')
};

export default TYPES;
