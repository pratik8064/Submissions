/* 
 * File:   main.c
 * Author: Pratik Suryawanshi
 *
 * Created on September 2, 2017, 5:36 PM
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

////////////////////////////////////////////////////////////////////////////////
//DATA STRUCTURES

typedef enum {
    SER = 0,
    EGR = 1,
    CSE = 2,
    EEE = 3
} Subject;

typedef struct {
    Subject subject;
    int number;
    int credits;
    char teacher[1024];
} Course;


////////////////////////////////////////////////////////////////////////////////
//GLOBAL VARIABLES

//place to store course information
Course* CourseCollection = NULL;
//number of courses in the collection. also the index of the next empty element.
int courseCount = 0;
int totalCredits = 0;
////////////////////////////////////////////////////////////////////////////////
//FORWARD DECLARATIONS
void branching(char option);
void course_insert();
void schedule_print();
void course_drop();
char* emap(Subject);
int sort(Course);
void shiftRight(int);

//main entry point. Starts the program by displaying a welcome and beginning an 
//input loop that displays a menu and processes user input. Pressing q quits.      
int main() {
	char input_buffer;
	printf("\n\nWelcome to ASU Class Schedule\n");
        CourseCollection = (Course*)malloc(sizeof(Course));
	//menu and input loop
	do {
		printf("\nMenu Options\n");
		printf("------------------------------------------------------\n");
		printf("a: Add a class\n");
		printf("d: Drop a class\n");
		printf("s: Show your classes\n");
		printf("q: Quit\n");
		printf("\nTotal Credits: %d\n\n", totalCredits);
                printf("Please enter a choice ---> ");

		scanf(" %c", &input_buffer);

		branching(input_buffer);
	} while (input_buffer != 'q');
	return 0;
}

//takes a character representing an inputs menu choice and calls the appropriate
//function to fulfill that choice. display an error message if the character is
//not recognized.
void branching(char option) {
	switch (option) {
	case 'a':
                course_insert();
		break;

	case 'd':
                course_drop();
		break;

	case 's':
                schedule_print();
		break;

	case 'q':
		// main loop will take care of this.
		break;

	default:
		printf("\nError: Invalid Input.  Please try again...");
		break;
	}
}

void shiftRight(int x){
    int i;
    for(i = courseCount;i > x;i--){
        CourseCollection[i] = CourseCollection[i - 1];
    }
}

int sort(Course temp){
//insertion is done in sorted way
    int i;
    if(courseCount==0)return 0;
    Course *x = CourseCollection;
    for(i = 0;i < courseCount;i++){
        if(temp.number< x[i].number){
            shiftRight(i);
            return i;
//i is location where new course will be added.
        }else{
            continue;
        }
    }
    return i;
}

char* emap(Subject s){
    switch(s){
        case SER:return "SER";
        case EGR:return "EGR";
        case CSE:return "CSE";
        case EEE: return "EEE";
    }
}


void course_insert(){
    Course temp;
    printf("What is the subject? (SER=0,EGR=1,CSE=2,EEE=3)?\n");
    int subject, number, credits;
    char teacher[1024];
    scanf("%d",&subject);
    printf("What is the number? (e.g. 240)\n");
    scanf("%d",&number);
    printf("How many credits is the class? (e.g. 3)\n");
    scanf("%d",&credits);
    printf("What is the name of the teacher?\n");
    scanf("%s",teacher);
    temp.credits = credits;
    temp.number = number;
    temp.subject = subject;
    strcpy(temp.teacher,teacher);

    CourseCollection = (Course*)realloc(CourseCollection,sizeof(Course)*(courseCount+1));
    CourseCollection[sort(temp)] = temp;
    courseCount++;
    totalCredits += temp.credits;
}

void schedule_print(){
    if(courseCount == 0)
        printf("\n No classes available yet. Add some classes \n");
    else{
        printf("Class Schedule:\n");
        int i = 0;
        while(i < courseCount){
            Course temp = CourseCollection[i];
            printf("%s%d  %d  %s\n", emap(temp.subject), temp.number, temp.credits, temp.teacher);
            i++;
        }
    }
}

void course_drop(){
    int number;
    printf("Enter number:\n");
    scanf("%d",&number);
    if(courseCount == 0)
        printf("No classes available yet. Add some classes");
    Course* temp = CourseCollection;
    int flag = 0;
    for(int i = 0;i < courseCount;i++){
        if(temp[i].number == number){
            flag = 1;
            printf("found the node now deleting it");
            memmove(&CourseCollection[i],&CourseCollection[i+1],sizeof(Course)*(courseCount - i - 1));
            courseCount--;
            totalCredits -= temp[i].credits;
            CourseCollection = (Course*)realloc(CourseCollection,sizeof(Course)*courseCount);
            break;
        }
    }
    if(flag == 0)
        printf("\nClass not found.\n");
}
