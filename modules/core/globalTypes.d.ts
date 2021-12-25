declare type AsyncReturnType<Func> = Func extends ((...args: any) => infer Result) ? (
    Result extends Promise<infer AsyncResult> ? AsyncResult : Result
) : never