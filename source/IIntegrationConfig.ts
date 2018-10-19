export declare type IntegrationType = 'Banner' | 'DegreeWorks';

/**
 * Represents a set of statements or queries that need to be run for a given integration
 *
 * @export
 * @interface IIntegrationConfig
 */
export default interface IIntegrationConfig {
    /**
     * The unique integration type descriptor
     *
     * @type {string}
     * @memberof IIntegrationConfig
     */
    type: IntegrationType;
    /**
     * A set of queries that must be run for this integration
     *
     * @type {string[]}
     * @memberof IIntegrationConfig
     */
    queries: string[];

    // TODO: do we need to version the config and/or track it's state (authorized to run / newly updated)
}