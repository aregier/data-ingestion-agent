import { Readable } from 'stream';
import { S3 } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import TYPES from '../../../ioc.types';
import * as crypto from 'crypto';

import IIngestionWriter from '../IDataWriter';

/**
 * Given a readable stream ingest data into an S3 bucket
 *
 * @export
 * @class S3Writer
 * @implements {IIngestionWriter}
 */
@injectable()
export default class S3Writer implements IIngestionWriter {

    private _s3Config: S3.ClientConfiguration;
    private _tenantId: string;
    private _bucket: string;

    constructor(
        @inject(TYPES.S3Config) s3Config: S3.ClientConfiguration,
        @inject(TYPES.TenantId) tenantId: string,
        @inject(TYPES.Bucket) bucket: string) {
        this._s3Config = s3Config;
        this._tenantId = tenantId;
        this._bucket = bucket;
    }

    public async ingest(stream: Readable) {
        const s3api = new S3(this._s3Config);

        const dataBody = stream;
        const params = {
            Body: dataBody,
            Bucket:  this._bucket + '/' + this._tenantId,
            Key: 'testUpload-' + crypto.randomBytes(8).toString('hex')
        };

        await s3api.upload(params).promise();
    }
}
