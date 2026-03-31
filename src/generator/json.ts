import { AgentAction, AgentManifest, AppMetadata, AuthConfig } from '../types';

export class ManifestGenerator {
  generate(
    actions: any[], 
    metadata: AppMetadata = {},
    capabilities: string[] = [],
    auth: AuthConfig = { type: 'none' },
    version = '1.0.0'
  ): AgentManifest {
    
    const transformedActions = actions.map(action => {
      // 1. Get the flat parameters from the parser
      const rawParams = action.parameters || {};
      
      // 2. Identify required fields
      const requiredList = Object.keys(rawParams).filter(
        key => rawParams[key].required === true
      );

      // 3. Wrap them into the JSON Schema format the SDK wants
      const nestedParameters = {
        type: 'object' as const,
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
      name:        metadata.name        ?? 'Web App',
      description: metadata.description ?? 'Auto-generated agent manifest',
      version,
      ...(metadata.author && { author: metadata.author }),
      ...(metadata.url    && { url:    metadata.url }),
      auth,
      metadata: { ...metadata },
      capabilities,
      actions: transformedActions as any, // Cast to any to bypass the flat type check
    };
  }
}