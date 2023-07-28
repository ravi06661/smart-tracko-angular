import { TechnologyStack } from "./technology-stack";

export class Course {

    public  courseId:number=0;
	public  courseName:string='';
	public  courseFees:string='';
	public  duration:string='';
	public  sortDescription:string='';
	public  createdDate:Date | undefined;
	public  updatedDate:Date | undefined;
    public  isDeleted=false;
    public  technologyStack:TechnologyStack | undefined;
}
