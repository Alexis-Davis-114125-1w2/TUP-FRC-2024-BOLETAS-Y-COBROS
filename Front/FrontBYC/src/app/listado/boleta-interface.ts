export interface BoletaInterface {
    id: number;
    period: string;
    issueDate : Date; 
  status: string; 
  first_expiration_amount: number;
  first_expiration_date : string; 
  second_expiration_date : string;
  second_expiration_amount : string
  payment_method: string; 
  selected?: boolean;
}

