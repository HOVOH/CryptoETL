import {QueryResolver} from "../../SubscriptionResolver";

export const monitors: QueryResolver = (root, args, context) => context.database.monitors.findAll();
