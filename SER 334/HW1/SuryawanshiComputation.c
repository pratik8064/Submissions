////////////////////////////////////////////////////////////////////////////////
//INCLUDES
#include <stdio.h>

int main(void)
{
	int i,n;
	float r, h;
	float total_vol = 0, curr_vol=0;
	printf("Enter number of cylinders : ");
        scanf("%d", &n);
	
        for(i=0;i<n;i++){
        
            printf("Enter radius : ");
            scanf("%f",&r);
            printf("Enter height : ");
            scanf("%f",&h);
            curr_vol = 3.14 * r * r * h;
            total_vol = total_vol + curr_vol;
            
	}
        
        printf("total volume is : %f", total_vol);

	return 0;
}