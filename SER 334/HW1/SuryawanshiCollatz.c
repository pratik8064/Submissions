
#include <stdio.h>

void termination(int);

void termination(int n){
    int x=0;
    while(n != 1){
        if(n % 2 == 0){
            n = n / 2;
        }else{
            n = 3 * n + 1;
        }
        x++;
    }
    printf("n is : %d\n",n);
    printf("number of iterations executed are : %d", x);
}

int main(void)
{
    int i,n;
    printf("Enter n: ");
    scanf("%d",&n);
    termination(n);
    return 0;
}
