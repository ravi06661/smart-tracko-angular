import { Course } from "./course";
import { StudentDetails } from "./student-details";

export class Fees {

    public 	 feesId:number=0;
    public student:StudentDetails=new StudentDetails;
    public  finalFees!:number;
	public  feesPaid:number=0;
    public course:Course=new Course;
	public  remainingFees:number=0;
    public date!: Date; 
	public  createdDate:Date | undefined
	public  updatedDate:Date | undefined;
	public  isCompleted:boolean=false;
    
}
