#include <stdio.h>
#include <stdlib.h>
#include <cuda.h>

#define DEBUG

typedef unsigned long ulong;
typedef unsigned short ushort;

__device__ ushort add(long a, long b)
{
	return (ushort)((a + b) % 65536l);
}

__device__ ushort multiply(long a, long b)
{
	long ch, cl, c;

	if (a == 0) a = 65536l;
	if (b == 0) b = 65536l;
	c = a * b;
	if (c) {
		ch = (c >> 16) & 65535l;
		cl = c & 65535l;
		if (cl >= ch) return (ushort) (cl - ch);
		return (ushort) ((cl - ch + 65537l) & 65535l);
	}
	if (a == b) return 1;
	return 0;
}

__global__ void IDEA_encryption(ushort *X, ushort *Y, long *K)
{
	
	ushort a, r, t0, t1, t2;
	//ushort i;	
	int tid = threadIdx.x;
	for (r = 0; r < 8; r++) {
		X[tid * 4 + 0] = multiply(X[tid * 4 + 0], K[r*6+0]);
		X[tid * 4 + 3] = multiply(X[tid * 4 + 3], K[r*6+3]);
		X[tid * 4 + 1] = add(X[tid * 4 + 1], K[r*6+1]);
		X[tid * 4 + 2] = add(X[tid * 4 + 2], K[r*6+2]);
		t0 = multiply(K[r*6+4], X[tid * 4 + 0] ^ X[tid * 4 + 2]);
		t1 = multiply(K[r*6+5], add(t0, X[tid * 4 + 1] ^ X[tid * 4 + 3]));
		t2 = add(t0, t1);
		X[tid * 4 + 0] ^= t1;
		X[tid * 4 + 3] ^= t2;
		a = X[tid * 4 + 1] ^ t2;
		X[tid * 4 + 1] = X[tid * 4 + 2] ^ t1;
		X[tid * 4 + 2] = a;
		#ifdef DEBUG
		/*printf("%u ", r + 1);
		for (i = 0; i < 6; i++)
			printf("%hu ", (ushort) K[r*6+i]);
		printf("%hu %hu %hu %hu\n", X[0], X[1], X[2], X[3]);*/
		#endif
	}
	Y[tid * 4 + 0] = multiply(X[tid * 4 + 0], K[8*6+0]);
	Y[tid * 4 + 3] = multiply(X[tid * 4 + 3], K[8*6+3]);
	Y[tid * 4 + 1] = add(X[tid * 4 + 2], K[8*6+1]);
	Y[tid * 4 + 2] = add(X[tid * 4 + 1], K[8*6+2]);
	#ifdef DEBUG
	/*printf("9 ");
	for (i = 0; i < 6; i++)
		printf("%hu ", (ushort) K[8*6+i]);
	printf("%hu %hu %hu %hu\n", Y[0], Y[1], Y[2], Y[3]);*/
	#endif
}

__device__ ushort bits_to_ushort(ushort *bits)
{
	ushort i, value = bits[0];

	for (i = 1; i < 16; i++)
		value = (ushort) ((value << 1) + bits[i]);
	return value;
}

__device__ void ushort_to_bits(ushort number, ushort *bits)
{
	ushort i, temp[16];
	int tid = threadIdx.x;
	for (i = 0; i < 16; i++) {
		temp[i] = (ushort) (number & 1);
		number >>= 1;
	}
	/*for (i = 0; i < 16; i++)
		bits[i] = temp[15 - i];*/
	if(tid<16)
	bits[tid] = temp[15-tid];

}

__device__ void cyclic_left_shift(ushort index, ushort *bits1,
                       ushort *bits2, long *K)
{
	ushort i;
	int tid = threadIdx.x;
	if (index == 0) {
		for (i = 0; i < 6; i++)
			ushort_to_bits((ushort) K[0*6+i], bits1 + 16 * i);
		ushort_to_bits((ushort) K[1*6+0], bits1 + 96);
		ushort_to_bits((ushort) K[1*6+1], bits1 + 112);
	}
	/*i = 0;
	for (j = 25; j < 128; j++)
		bits2[i++] = bits1[j];
	for (j = 0; j < 25; j++)
		bits2[i++] = bits1[j];*/
	if( tid < 103)
  		bits2[tid] = bits1[tid + 25];
	else if(tid >= 103 && tid <128)
  		bits2[tid] = bits1[tid - 103];

	
	switch (index) {
		case 0 :
			/*for (i = 2; i < 6; i++)
				K[1][i] = bits_to_ushort(bits2 + 16 * (i - 2));
			for (i = 0; i < 4; i++)
				K[2][i] = bits_to_ushort(bits2 + 64 + 16 * i);*/
			if(tid >=2 && tid < 6)
				K[1*6+tid] = bits_to_ushort(bits2 + 16 * (tid - 2 ));
			if(tid < 4)
				K[2*6+tid] = bits_to_ushort(bits2 + 64 + 16 * tid);

		break;
		case 1 :
			K[2*6+4] = bits_to_ushort(bits2);
			K[2*6+5] = bits_to_ushort(bits2 + 16);
			/*for (i = 0; i < 6; i++)
				K[3][i] = bits_to_ushort(bits2 + 32 + 16 * i);*/
			if(tid < 6)
				K[3*6+tid] = bits_to_ushort(bits2 + 32 + 16 * tid);
		break;

		case 2 :
	
			/*for (i = 0; i < 6; i++)
				K[4*6+i] = bits_to_ushort(bits2 + 16 * i);*/
			if(tid < 6)
				K[4*6+tid] = bits_to_ushort(bits2 + 16 * tid);
			K[5*6+0] = bits_to_ushort(bits2 + 96);
			K[5*6+1] = bits_to_ushort(bits2 + 112);
		break;
		case 3 :
	
			/*for (i = 2; i < 6; i++)
				K[5][i] = bits_to_ushort(bits2 + 16 * (i - 2));
			for (i = 0; i < 4; i++)
				K[6][i] = bits_to_ushort(bits2 + 64 + 16 * i);*/
    
			if(tid >=2 && tid < 6)
				        K[5*6+tid] = bits_to_ushort(bits2 + 16 * (tid - 2));
			 if(tid < 4)
				        K[6*6+tid] = bits_to_ushort(bits2 + 64 + 16 * tid);
		break;
		case 4 :
			K[6*6+4] = bits_to_ushort(bits2);
			K[6*6+5] = bits_to_ushort(bits2 + 16);

			/*for (i = 0; i < 6; i++)
				K[7][i] = bits_to_ushort(bits2 + 32 + 16 * i);*/

			if(tid < 6)
				K[7*6+tid] = bits_to_ushort(bits2 + 32 + 16 * tid);
		break;
		case 5 :
			/*for (i = 0; i < 4; i++)
				K[8][i] = bits_to_ushort(bits2 + 16 * i);*/

			if(tid < 4)
		        K[8*6+tid] = bits_to_ushort(bits2 + 16 * tid);
		break;
	}
}

__global__ void IDEA_encryption_key_schedule(ushort *key, long *K)
{
	ushort bits1[128], bits2[128];
	int tid = threadIdx.x;

	//for (i = 0; i < 6; i++) K[0][i] = key[i];
	if(tid < 6)
	  	K[0*6+tid] = key[tid];
	if(tid == 32)
  		K[1*6+0] = key[6], K[1*6+1] = key[7];
  
	cyclic_left_shift(0, bits1, bits2, K);
	cyclic_left_shift(1, bits2, bits1, K);
	cyclic_left_shift(2, bits1, bits2, K);
	cyclic_left_shift(3, bits2, bits1, K);
	cyclic_left_shift(4, bits1, bits2, K);
	cyclic_left_shift(5, bits2, bits1, K);
	
}

__device__ void extended_euclidean(long a, long b, long *x, long *y, long *d)
{
	long q, r, x1, x2, y1, y2;

	if (b == 0) {
		*d = a, *x = 1, *y = 0;
		return;
	}
	x2 = 1, x1 = 0, y2 = 0, y1 = 1;
	while (b > 0) {
		q = a / b, r = a - q * b;
		*x = x2 - q * x1;
		*y = y2 - q * y1;
		a = b, b = r, x2 = x1, x1 = *x, y2 = y1, y1 = *y;
	}
	*d = a, *x = x2, *y = y2;
}

__device__ long inv(ushort ub)
{
	long d, a = 65537l, b = ub, x, y;

	if (ub == 0) return 65536l;
	extended_euclidean(a, b, &x, &y, &d);
	if (y >= 0) return (ushort) y;
	return (ushort) (y + 65537l);
}

__global__ void IDEA_decryption_key_schedule(long *K, long *L)
{
	ushort r8, r9;
	int tid = threadIdx.x;
	if(tid == 0){
		L[0*6+0] = inv((ushort) K[8*6+0]);
		L[0*6+1] = - K[8*6+1];
		L[0*6+2] = - K[8*6+2];
		L[0*6+3] = inv((ushort) K[8*6+3]);
		L[0*6+4] =  K[7*6+4];
		L[0*6+5] =  K[7*6+5];
}

	if(tid>0 && tid <8){
    		r9 = (ushort) (8 - tid);
    		r8 = (ushort) (7 - tid);
    		L[tid*6+0] = inv((ushort) K[r9*6+0]);
    		L[tid*6+1] = - K[r9*6+2];
    		L[tid*6+2] = - K[r9*6+1];
    		L[tid*6+3] = inv((ushort) K[r9*6+3]);
    		L[tid*6+4] = K[r8*6+4];
    		L[tid*6+5] = K[r8*6+5];
	}

	if(tid == 0){
		L[8*6+0] = inv((ushort) K[0*6+0]);
		L[8*6+1] = - K[0*6+1];
		L[8*6+2] = - K[0*6+2];
		L[8*6+3] = inv((ushort) K[0*6+3]);
		L[8*6+4] = L[8*6+6] = 0;
	}
}

int main(int argc, char *argv[])
{	
	/*int devcount;
	cudaGetDeviceCount(&devcount);
	printf("%d ",devcount);
	for(int i=0;i<devcount;i++){
		cudaDeviceProp prop;
		cudaGetDeviceProperties(&prop , i);
		printf("%d ",prop.warpSize);
	}*/
	int tc=512;
	int count;
	long *K, *L;K=NULL;L=NULL;
	long *dev_K , *dev_L; dev_K=NULL; dev_L = NULL;
	ushort key[8] = {1, 2, 3, 4, 5, 6, 7, 8};
	ushort *X, *Y;
	ushort *dev_X, *dev_Y;
	ushort *dev_key = NULL;
  
	FILE *in_file  = fopen("/home/jignesh/input.jpg", "r"); 
	FILE *out_file = fopen("/home/jignesh/output.jpg", "w"); 
	FILE *mid_w = fopen("/home/jignesh/encrypt.jpg", "w");
	if (in_file == NULL || out_file == NULL) 
	{
		printf("Error! Could not open file\n"); 
		exit(-1); 
	}
	
	K = (long *)malloc(54 * sizeof(long ));
	L = (long *)malloc(54 * sizeof(long ));

	cudaMalloc((void **) &dev_key , 16);
	cudaMemcpy( dev_key, key, 16, cudaMemcpyHostToDevice);

 	size_t pitch;
	cudaMallocPitch(&dev_K, &pitch, sizeof(long)*9, 6);
	cudaMallocPitch(&dev_L, &pitch, sizeof(long)*9, 6);
	
	IDEA_encryption_key_schedule<<<1,128>>>(dev_key, dev_K);

	cudaMemcpy( K , dev_K, 9*6* sizeof(long *),cudaMemcpyDeviceToHost);

	X = (ushort *)malloc(tc * 4 * sizeof(ushort));
	Y = (ushort *)malloc(tc * 4 * sizeof(ushort));

	count = fread( X,2,tc*4,in_file);

	cudaMalloc((void **) &dev_Y , tc*4*2);
	cudaMalloc((void **) &dev_X , tc*4*2);	

	while(count==tc * 4){
	   	cudaMemcpy( dev_X, X,tc * 8, cudaMemcpyHostToDevice);
   
		IDEA_encryption<<<1,tc>>>(dev_X, dev_Y, dev_K);

		cudaMemcpy( Y, dev_Y,tc * 8, cudaMemcpyDeviceToHost);

		fwrite( Y,2,tc*4,mid_w);
		count = fread( X,2,tc*4,in_file);
	}
	if(count < tc*4 && count > 0){
		fwrite( X,2,count,mid_w);
	}
	
	fclose(mid_w);
	FILE *mid_file = fopen("/home/jignesh/encrypt.jpg", "r");

	IDEA_decryption_key_schedule<<<1,8>>>(dev_K, dev_L);

	count = fread( Y,2,tc*4,mid_file);
	while(count==tc * 4){
		cudaMemcpy( dev_Y, Y,tc * 8, cudaMemcpyHostToDevice);
	
		IDEA_encryption<<<1,tc>>>(dev_Y, dev_X, dev_L);
	
		cudaMemcpy( X, dev_X,tc * 8, cudaMemcpyDeviceToHost);
 
		fwrite( X,2,tc*4,out_file);
		count = fread( Y,2,tc*4,mid_file);
	}
	if(count < tc*4 && count > 0){
		fwrite( Y,2,count,out_file);
	} 
	free(K);
	free(L);
	return 0;
}
