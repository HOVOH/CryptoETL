import {QueryResolver} from "../../SubscriptionResolver";

export const pairs: QueryResolver = async (root, args, context)=> {
    const monitors = await context.database.monitors.findAll();
    return monitors.map((monitor) => monitor.pair);
}
