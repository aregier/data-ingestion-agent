
/**
 * A basic interface for implementing logic to discover the schema
 * of an integration so that restoration efforts can more easily
 * and accurately reproduce the system and its data.
 *
 * @export
 * @interface IDDLHelper
 */
export default interface IDDLHelper {
    /**
     * Returns a query statement to discover the DDL applicable to the
     * specified objects that are expected to exist in the system
     *
     * @memberof IDDLHelper
     */
    getDDLQuery: (validObjects: string[]) => Promise<string>;
}
