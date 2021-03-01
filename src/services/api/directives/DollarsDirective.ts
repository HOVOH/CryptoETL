import {SchemaDirectiveVisitor} from "apollo-server";
import {defaultFieldResolver} from "graphql";
import {moneyConvert, MoneyUnits} from "../../../utils/dollars";

export default class DollarsDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field;
        field.resolve = async function (...args) {
            const result = await resolve.apply(this, args);
            if (typeof result === 'number') {
                return moneyConvert(result, MoneyUnits.BASE, MoneyUnits.DOLLARS);
            } else if (Array.isArray(result)){
                return result.map(n => moneyConvert(n, MoneyUnits.BASE, MoneyUnits.DOLLARS))
            }
            return result;
        };
    }
}
