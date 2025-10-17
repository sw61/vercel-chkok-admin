export interface EditPayload {
  title: string;
  content: string;
}
export interface EditParams {
  id: string;
  payload: EditPayload;
}
