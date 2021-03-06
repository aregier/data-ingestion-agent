import { Readable, Stream } from 'stream';
import { inject, injectable } from 'inversify';
import TYPES from '../../../ioc.types';
import * as crypto from 'crypto';

import IDataWriter from '../IDataWriter';
import { Logger } from 'winston';
import AWS = require('aws-sdk');

let S3_PART_SIZE_MB = 10;
if (process.env.S3_PART_SIZE_MB) {
    S3_PART_SIZE_MB = Number(process.env.S3_PART_SIZE_MB);
}
let S3_QUEUE_SIZE = 10;
if (process.env.S3_QUEUE_SIZE) {
    S3_QUEUE_SIZE = Number(process.env.S3_QUEUE_SIZE);
}

/**
 * Given a readable stream ingest data into an S3 bucket
 *
 * @export
 * @class S3Writer
 * @implements {IDataWriter}
 */
@injectable()
export default class S3Writer implements IDataWriter {
    constructor(
        @inject(TYPES.Bucket) private _bucketPath: string,
        @inject(TYPES.Logger) private _logger: Logger) {
    }

    public async ingest(stream: Readable, folderPath: string, fileNamePrefix: string) {
        const dataBody = stream;
        const parms = {
            Body: dataBody,
            Bucket:  this._bucketPath + '/' + folderPath,
            Key: fileNamePrefix + '_' + crypto.randomBytes(8).toString('hex')
        };

        // Parallelize multi-part upload
        const s3Obj = new AWS.S3();
        const managedUpload: AWS.S3.ManagedUpload = s3Obj.upload(parms,
            { partSize: 1024 * 1024 * S3_PART_SIZE_MB, queueSize: S3_QUEUE_SIZE });

        managedUpload.on('httpUploadProgress', (evt) => {
            this._logger.verbose(`Progress: ${evt.loaded} bytes uploaded (File: ${parms.Key})`);
        });

        await managedUpload.promise();
    }
}
