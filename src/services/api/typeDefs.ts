import {gql} from 'apollo-server';
import { readFileSync } from "fs";
import { resolve } from "path";

export const typeDefs = gql(
    readFileSync(resolve("resources", "schema.graphql"), { encoding: "utf8" })
);
