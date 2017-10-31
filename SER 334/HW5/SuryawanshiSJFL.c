#include <stdio.h>
#include <stdlib.h>
#include <string.h>

FILE* fptr;

typedef struct {
    int id;
    float val;
}process;

typedef struct {
  process* procList;
}tick;

float cToI(char c){
    char arr[10] = {};
    int i = 0;
    c = fgetc(fptr);
    int flag = 0;
    while(c != '\n' && i < 10){
        if(c == '.'){
            flag = 1;
        }
        arr[i] = c;
        c = fgetc(fptr);
        i++;
    }
    if(flag){
        return atof(arr);
    }else{
        int n = atoi(arr);
        return (float)n;
    }
}

void printTickList(tick* temp, int ticks, int n){
  int i,j;
  for(i = 0;i < ticks;i++){
    printf("Tick %d\n",i);
    for(j = 0;j < n;j++){
      printf("Process %d - val %d\n", temp[i].procList[j].id, (int)temp[i].procList[j].val);
    }
  }
}

void insertionSort(process* list, int n){
    process temp;
    int i, j;
    for (i = 1; i < n; i++){
       temp = list[i];
       j = i-1;
       while (j >= 0 && list[j].val > temp.val){
           list[j+1] = list[j];
           j = j-1;
       }
       list[j+1] = temp;
   }
}

void SJF(tick* tickList, int ticks, int n){
    int i,j;
    for(i = 0;i< ticks;i++){
        process * temp = tickList[i].procList;
        insertionSort(temp, n);
    }
}

void SJF_print(tick*tickList, int ticks, int n){
    int i,j;
    printf("\n== Shortest - Job - First ==\n");
    int tTime = 0;
    int waitTime = 0;
    for(i = 0;i < ticks;i++){
        printf("Simulating %d th round of process @ time %d\n", i,tTime);
        for(j = 0;j < n;j++){
            printf("  Process %d took %d\n", tickList[i].procList[j].id, (int)tickList[i].procList[j].val);
            tTime += tickList[i].procList[j].val;
            if(j < n-1){
                waitTime += tickList[i].procList[j].val;
            }
        }
    }
    tTime += waitTime;
    printf("\nTurnaround Time : %d\n", tTime);
    printf("Wait Time : %d\n", waitTime);
}

float getOriginalVal(tick* tickList, int tickNum, int id, int n){
    int i;
    for(i = 0; i < n;i++){
        if(tickList[tickNum].procList[i].id == id){
            return tickList[tickNum].procList[i].val;
        }
    }
    return 0;
}

void SJF_live_print(tick* tickList, tick* original, int ticks, int n){

    int i,j;
    printf("\n\n== Shortest - Job - First Live ==\n");
    int tTime = 0;
    int waitTime = 0;
    int error = 0;
    for(i = 0;i < ticks;i++){
        printf("\nSimulating %d th tick of processes @ time %d\n", i,tTime);
        for(j = 0;j < n;j++){
            //Process 0 was estimated for 10 and took 6.
            // if proc 1 is printing then proc 1 of original should print
            float temp = getOriginalVal(original, i, tickList[i].procList[j].id, n);
            printf("  Process %d was estimated for %d and took %d\n", tickList[i].procList[j].id, (int)tickList[i].procList[j].val, (int)temp);
            tTime += temp;
            error += abs((int)temp - (int)tickList[i].procList[j].val);
            if(j < n-1){
                waitTime += temp;
            }
        }
    }
    tTime += waitTime;
    printf("\nTurnaround Time : %d\n", tTime);
    printf("Wait Time : %d\n", waitTime);
    printf("Estimated error : %d\n\n", error);
}

void SJF_live(tick* temp, tick*original, int ticks, float* tou, float* alpha, int n){

    int i,j;
    for(i = 0;i < ticks;i++){
        for(j = 0;j < n;j++){
            if(i < n-1){
                temp[i].procList[j].val = tou[j];
            }else{
                float alp = alpha[j];
                float t = tou[j];
                //float lastOriginal = original[i-1].procList[j].val;
                float lastOriginal = getOriginalVal(original, i-1, temp[i].procList[j].id, n);
                float lastPre = temp[i-1].procList[j].val;
                float form = alp * lastOriginal + (1 - alp) * lastPre;
                temp[i].procList[j].val = form;
            }
        }
    }
  SJF(temp, ticks, n);
  SJF_live_print(temp, original, ticks, n);

}

int main(){

    char filename[30] = "./data.txt", c;
    fptr = fopen(filename, "r");
    if (fptr == NULL){
        printf("Cannot open file \n");
        exit(0);
    }


    int i;
    int base,j;


    int ticks = cToI(c);
    int n = cToI(c);
    int size = 2 + n*(ticks+3);
    float arr[size];
    arr[0] = ticks;
    arr[1] = n;
    for(i = 2;i < size;i++){
        arr[i] = cToI(c);
    }

    float touArray[n];
    float alphaArray[n];

    int idIndex = 2;
    int touIndex = 3;
    int alphaIndex = 4;

    // steps to fill tickList by given file
    tick tickList[ticks];
    for(i = 0;i < ticks;i++){
        tickList[i].procList = NULL;
        process* procList = (process *)malloc(n * sizeof(process));
        for(j = 0;j < n;j++){
            process *tempProcess = (process*)malloc(sizeof(process));
            tempProcess->id = j;
            tempProcess->val = 0;
            procList[j] = *tempProcess;
        }
        tickList[i].procList = procList;
    }

    for(i = 0;i < n;i++){
        if(i == 0)
            base = 0;
        else
            base = 3;
        int processID = arr[base*i + idIndex + i*ticks];
        touArray[i] = arr[base*i + touIndex + i*ticks];
        alphaArray[i] = arr[base*i + alphaIndex + i*ticks];
        for(j = 0;j < ticks;j++){
            tickList[j].procList[i].id = i;
            tickList[j].procList[i].val = arr[base*i + 5 + i*ticks + j];
        }
    }
    // now tickList and touArray , alphaArray are ready
    tick liveTickList[ticks];
    for(i = 0;i < ticks;i++){
        liveTickList[i].procList = NULL;
        process* procList = (process *)malloc(n * sizeof(process));
        for(j = 0;j < n;j++){
            process *tempProcess = (process*)malloc(sizeof(process));
            tempProcess->id = j;
            tempProcess->val = 0;
            procList[j] = *tempProcess;
        }
        liveTickList[i].procList = procList;
    }

    tick* temp = NULL;
    temp = &tickList;
    tick* tempLive = NULL;
    tempLive = &liveTickList;
    float* tou = &touArray;
    float* alpha =  &alphaArray;
    SJF(temp, ticks, n);
    SJF_print(temp, ticks,n);
    SJF_live(tempLive, temp, ticks,tou, alpha,n);
    return 0;
}
