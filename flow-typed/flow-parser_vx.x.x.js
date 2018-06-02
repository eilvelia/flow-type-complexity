declare module 'flow-parser' {
  declare export type Options = {
    esproposal_decorators?: boolean,
    esproposal_class_instance_fields?: boolean,
    esproposal_class_static_fields?: boolean,
    esproposal_export_star_as?: boolean,
    esproposal_optional_chaining?: boolean,
    esproposal_nullish_coalescing?: boolean,
    types?: boolean // default = true
  };

  declare export function parse(source: string, options: Options): Object;
}
