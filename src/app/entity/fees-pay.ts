import { Fees } from "./fees";

export class FeesPay {
    public  payId:number=0;

	public fees:Fees=new Fees;
	public  feesPayAmount:number=0;
	public payDate!: Date;
	public  recieptNo:string='';
	public description:string='';
	public  createDate:Date | undefined;
	public  updatedDate:Date | undefined;
}
