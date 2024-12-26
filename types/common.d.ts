type ToSingleKeyValue<T, L extends string = "label", U extends string = "value"> =
    {
        readonly label: T[L]
        readonly value: T[U]
    } extends {
        readonly label: infer K
        readonly value: infer V
    }
        ? K extends PropertyKey
            ? {
                    [Key in K]: V;
                }
            : never
        : never
type MergeIntersection<A> = A extends infer T
    ? { [Key in keyof T]: T[Key] }
    : never

type ToKeyValue<T, L extends string = "label", U extends string = "value"> = T extends readonly [infer A, ...infer B]
    ? B["length"] extends 0
        ? ToSingleKeyValue<A, L, U>
        : MergeIntersection<ToSingleKeyValue<A, L, U> & ToKeyValue<B, L, U>>
    : []
