"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestGenerator = void 0;
class ManifestGenerator {
    generate(actions, metadata = {}, capabilities = [], auth = { type: 'none' }, version = '1.0.0') {
        const transformedActions = actions.map(action => {
            // 1. Get the flat parameters from the parser
            const rawParams = action.parameters || {};
            // 2. Identify required fields
            const requiredList = Object.keys(rawParams).filter(key => rawParams[key].required === true);
            // 3. Wrap them into the JSON Schema format the SDK wants
            const nestedParameters = {
                type: 'object',
                properties: rawParams,
                ...(requiredList.length > 0 && { required: requiredList })
            };
            return {
                ...action,
                parameters: nestedParameters, // Now nested in the JSON output
                returns: action.returns || { type: 'object', description: '' }
            };
        });
        return {
            name: metadata.name ?? 'Web App',
            description: metadata.description ?? 'Auto-generated agent manifest',
            version,
            ...(metadata.author && { author: metadata.author }),
            ...(metadata.url && { url: metadata.url }),
            auth,
            metadata: { ...metadata },
            capabilities,
            actions: transformedActions, // Cast to any to bypass the flat type check
        };
    }
}
exports.ManifestGenerator = ManifestGenerator;
