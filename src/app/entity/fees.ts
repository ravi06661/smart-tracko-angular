import { Course } from "./course";
import { StudentDetails } from "./student-details";

export class Fees {

    public 	 feesId:number=0;
    public studentdetalis:StudentDetails=new StudentDetails;
    public  finalFees:number=0;
	public  feesPay:number=0;
    public course:Course=new Course;
	public  remainingFees:number=0;
    public  date:Date | undefined;
	public  createdDate:Date | undefined;
	public  updatedDate:Date | undefined;
	public  isCompleted:boolean=false;
    
}
