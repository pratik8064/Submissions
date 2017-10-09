#include <stdio.h>
#include <string.h>

//macros: constants
#define CHUNK_LENGTH (20+1)  
                           
#define NUMBER_OF_CHUNKS 4 
#define DECRYPTION_SHIFT 5 

//forward declarations
void sort_chunks();
void decrypt_chunks();
void display_chunks();

char chunks[NUMBER_OF_CHUNKS][CHUNK_LENGTH];

int main() {
	strcpy(chunks[0], "2i1%fsi%fs%jstwrtzx%");
	strcpy(chunks[1], "1'H%nx%vznwp~1%kqf|j");
	strcpy(chunks[2], "4R3%Wnyhmnj%%%%%%%%%");
	strcpy(chunks[3], "3xzhhjxx3'%2%Ijssnx%");
        
	sort_chunks();

	decrypt_chunks();

	display_chunks();
        
	return 0; 
}

void swap_strings(char* x, char* y) {
	char temp[CHUNK_LENGTH];
	strcpy(temp, x);
	strcpy(x, y);
	strcpy(y, temp);
}

void sort_chunks() {
    int i,j,temp;
    for (i = 0; i < NUMBER_OF_CHUNKS-1; i++){
        temp = i;
        for (j = i + 1; j < NUMBER_OF_CHUNKS; j++){
          if (chunks[j][0] < chunks[temp][0]){
            temp = j;
          }
        }
        swap_strings(chunks[temp], chunks[i]);
    }
    
}

void decrypt_chunks() {
    
    int i;
    char *j;
    for(i = 0;i < NUMBER_OF_CHUNKS;i++){
        j = chunks[i];
        j++;
        while(*j != '\0'){
            *j = *j - DECRYPTION_SHIFT;
            j++;
        }
    }
    
	//TODO: Implement decrypt_chunks(). Loop over each string in the array
	//      and shift the characters in it by subtracting DECRYPTION_SHIFT value
	//		from them. Use pointer arithmetic to access individual characters but
	//		array access to the strings. Remember that C-style strings have a null
	//		terminator at the end. Do not apply the shift to the terminator.
	//		(Hint: to avoid doing double pointer arithmatic, save a char* pointer
	//		to the active chunk[?] in the outer loop but before the inner loop.
	//		Then the inner loop is only concerned with a single array of
	//		characters rather than an array of strings.)
}

void display_chunks() {
    int i;
    char * j;    
    for(i = 0;i < NUMBER_OF_CHUNKS;i++){
        j = chunks[i];
        j++;
        while(*j != '\0'){
            printf("%c",*j);
            j++;
        }
    }
}
