import type {RulesSpecification} from "../../routes/api/rules/+server";
import type {ObjectTypesSpecification} from "../../routes/api/objectTypes/+server";
import {getNamespaces, getObjectTypes, getRules} from "$lib/helpers/apiHelper";

class SpecificationCache {
    public _rules: RulesSpecification | undefined;
    private _objectTypes: ObjectTypesSpecification | undefined;
    private _namespaces: string[] | undefined;

    public async rules () {
        if (!this._rules) {
            this._rules = await getRules();
        }

        return this._rules;
    }

    public async objectTypes () {
        if (!this._objectTypes) {
            this._objectTypes = await getObjectTypes();
        }

        return this._objectTypes;
    }

    public async namespaces () {
        if (!this._namespaces) {
            this._namespaces = await getNamespaces();
        }

        return this._namespaces;
    }
}

export const specifications = new SpecificationCache();
