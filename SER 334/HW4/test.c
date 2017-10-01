#include <stdio.h>
#include <sys/types.h>
#include <dirent.h>
#include <sys/stat.h>
#include <unistd.h>
#include <string.h>
#include <strings.h>
#include <stdlib.h>

typedef struct{
	char path[1024];
	long int size;
	char unit[2];
}Node;

Node list[256];

int listIndex = 0;

long int getDetails(DIR *, char*);

void setUnit(Node*);
void sortList();
int main(){
	DIR *d;	
	d = opendir(".");
	if(d == NULL) {
		perror("prsize");
		exit(1);
	}
	
	Node* root = (Node*)malloc(sizeof(Node));
	root->path[0] = '.';
	root->size = getDetails(d, ".");
	setUnit(root);
	list[listIndex] = *root;		
	listIndex++;
	int i;
	sortList();
	for(i = 0;i < listIndex;i++){
		if(list[i].size  != 0)
			printf("%5ld%s\t%s\n",list[i].size, list[i].unit, list[i].path);	
	}
}

void setUnit(Node* node){
	
	if(node->size < 1024){
		node->unit[0] = 'B';
	}else if(node->size > 1024 ){
		node->size = node->size/1024;
		node->unit[0] = 'K';
	}else if(node->size > 1048576){
		node->size = node->size/(1024*1024);
		node->unit[0] = 'M';
		node->unit[1] = 'B';
	}
	
}

void sortList(){
   int i, j;
   Node key;
   for (i = 1; i < listIndex; i++){
       key = list[i];
       j = i-1;
       while (j >= 0 && strcmp(list[j].path, key.path) < 0){
           list[j+1]= list[j];
           j = j-1;
       }
       list[j+1] = key;
   }
}	

long int getDetails(DIR * d, char* parent){
	
	DIR *subDir;
	struct dirent *current;
	struct stat statDetails;
	char pathName[1024];
	long int parentSize = 0;
	
	for (current = readdir(d); current != NULL; current = readdir(d)) {
		if(strcmp(current->d_name, ".") == 0 || strcmp(current->d_name, "..") == 0)
      			continue;
		long int currentSize = 0;
		strcpy(pathName,parent);
		strcat(pathName,"/");
		stat(current->d_name, &statDetails);
		strcat(pathName, current->d_name);		
		if(S_ISREG(statDetails.st_mode)){
			currentSize = statDetails.st_size;
		}else if(S_ISDIR(statDetails.st_mode)){
			char tempPath[1024];
			if((getcwd(tempPath, 1024)) == NULL)
				printf("error occured while reading filepath name\n");
			else{
				currentSize = statDetails.st_size;
				getcwd(tempPath, 1024);
				char currentPath[1024];
				strcpy(currentPath, tempPath);
				strcat(tempPath, "/");
				strcat(tempPath, current->d_name);
				chdir(tempPath);
				subDir = opendir(tempPath);				
				if(subDir == NULL) {
					printf("failed to open new dir");					
					perror("prsize");
					exit(1);
				}else{
					currentSize += getDetails(subDir,pathName);
					chdir(currentPath);
				}
			}
		}
		Node* tempNode = (Node*)malloc(sizeof(Node));
		strcpy(tempNode->path,pathName);
		tempNode->size = currentSize;
		setUnit(tempNode);
		list[listIndex] = *tempNode;		
		listIndex++;
		parentSize += currentSize;

	}
	return parentSize;
	closedir(d);
}