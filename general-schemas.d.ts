import {
  Attribute,
  ComponentAttribute,
  DynamicZoneAttribute,
  GetAttribute,
  GetAttributes,
  GetAttributesKey,
  GetAttributeValue,
  GetComponentAttributeValue,
  GetDynamicZoneAttributeValue,
  GetMediaAttributeValue,
  GetRelationAttributeValue,
  MediaAttribute,
  PasswordAttribute,
  PrivateAttribute,
  RelationAttribute,
  RequiredAttribute,
  utils,
} from '@strapi/strapi'

// Helper used to add an ID attribute to another type
export type WithID = { id: number }

// Values resolvers that we need to replace by custom ones & remove from the base GetAttributesValues implementation
type ExcludedValuesResolvers<T extends Attribute> =
  | GetRelationAttributeValue<T>
  | GetComponentAttributeValue<T>
  | GetDynamicZoneAttributeValue<T>
  | GetMediaAttributeValue<T>

// Custom GetRelationAttributeValue implementation for the content api
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ContentAPIRelationValue<T extends Attribute> = T extends RelationAttribute<infer _S, infer R, infer G>
  ? R extends `${string}Many`
    ? Omit<ResponseCollection<G>, 'meta'>
    : Response<G>
  : never

// Custom GetComponentAttributeValue implementation for the content api
type ContentAPIComponentValue<T extends Attribute> = T extends ComponentAttribute<infer U, infer R>
  ? WithID & (R extends true ? GetAttributesValues<U>[] : GetAttributesValues<U>)
  : never

// Custom GetMediaAttributeValue implementation for the content api
type ContentAPIMediaValue<T extends Attribute> = T extends MediaAttribute<infer R>
  ? R extends true
    ? DataWrapper
    : DataWrapper[]
  : never

// Custom GetDynamicZoneAttributeValue implementation for the content api
type ContentAPIDynamicZoneValue<T extends Attribute> = T extends DynamicZoneAttribute<infer C>
  ? Array<
      utils.GetArrayValues<C> extends infer P
        ? P extends utils.SchemaUID
          ? GetAttributesValues<P> & { __component: P } & WithID
          : never
        : never
    >
  : never

// Aggregation of all the custom content api's custom value resolvers
type ContentAPIValueResolvers<T extends Attribute> =
  | ContentAPIRelationValue<T>
  | ContentAPIComponentValue<T>
  | ContentAPIDynamicZoneValue<T>
  | ContentAPIMediaValue<T>

// Custom GetAttributeValue implementation based on specific content api rules
// If the given attribute isn't handled by the custom resolvers, then it'll fallback
// to the base implementation and its resolvers
type GetValue<T extends utils.SchemaUID, U extends GetAttributesKey<T>> = GetAttribute<T, U> extends infer P
  ? P extends Attribute
    ? ContentAPIValueResolvers<P> | Exclude<GetAttributeValue<P>, ExcludedValuesResolvers<P>>
    : never
  : never

// Get the list of allowed attributes' names for the content api
// Removes privates and password fields for now
// note: creatorsFields are already handled since their private value is dynamic (set at content-type loading & dumped into the schemas typings)
type GetAllowedAttributesKey<T extends utils.SchemaUID> = GetAttributes<T> extends infer A
  ? keyof Omit<A, utils.KeysBy<A, PrivateAttribute | PasswordAttribute | RequiredAttribute>>
  : never

type GetRequiredAttributesKey<T extends utils.SchemaUID> = GetAttributes<T> extends infer A
  ? keyof Pick<A, utils.KeysBy<A, RequiredAttribute>>
  : never

// Custom GetAttributesValues implementation which includes specific
// content API logic (sanitation, custom value resolvers, etc...)
export type GetAttributesValues<T extends utils.SchemaUID> = {
  [key in GetAllowedAttributesKey<T>]?: GetValue<T, key>
} & { [key in GetRequiredAttributesKey<T>]: GetValue<T, key> }

// Wrapper which contains the id/attributes couple, used to type the responses' data property
export interface DataWrapper<T extends utils.SchemaUID | null = null> extends WithID {
  attributes: T extends utils.SchemaUID ? GetAttributesValues<T> : any
}

// Represent a response structure for a single entity
export interface Response<T extends utils.SchemaUID> {
  data: DataWrapper<T> | null
}

// Represent a response structure for an entity collection
export interface ResponseCollection<T extends utils.SchemaUID> {
  data: DataWrapper<T>[] | null
  meta: CollectionMetadata
}

export interface CollectionMetadata {
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never

type NullUnionOmit<T, K extends string | number | symbol> = null extends T
  ? UnionOmit<NonNullable<T>, K>
  : UnionOmit<T, K>

type RecursiveOmitHelper<T, K extends string | number | symbol> = {
  [P in keyof T]: RecursiveOmit<T[P], K>
}

type RecursiveOmit<T, K extends string | number | symbol> = T extends {
  [P in K]: any
}
  ? NullUnionOmit<RecursiveOmitHelper<T, K>, K>
  : RecursiveOmitHelper<T, K>

export type GetAttributeValuesWithoutId<T extends utils.SchemaUID> = RecursiveOmit<GetAttributesValues<T>, 'id'>

export type RequireAttributes<T extends object, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

export type NullableAttributes<T extends object> = {
  [K in keyof T]: T[K] | null
}

export type AddID<T extends object> = T & {
  id: number
}
