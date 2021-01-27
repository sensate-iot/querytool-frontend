
export class Response<TValue> {
  public responseId: string;
  public errors: string[];
  public data: TValue;
}

