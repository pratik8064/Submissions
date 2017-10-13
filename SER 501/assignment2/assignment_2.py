# -*- coding: utf-8 -*-
from numpy import array
from numpy import asarray

# STOCK_PRICES  = [100,113,110,85,105,102,86,63,81,101,94,106,101,79,94,90,97]

STOCK_PRICE_CHANGES = [13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7]

# ==============================================================


# The brute force method to solve max subarray problem
def find_maximum_subarray_brute(A):

    theMaxSum = A[0]
    i = 0
    left = i
    right = i
    sum = 0
    while(i < len(A)):
        j = i
        sum = 0
        while(j < len(A)):
            sum += A[j]
            if(theMaxSum < sum):
                theMaxSum = sum
                left = i
                right = j
            j = j + 1
        i = i + 1
    print("find_maximum_subarray_brute output")
    print("Start Index : ", left)
    print("End Index : ", right)
    print("MaxSUM : ", theMaxSum)
    print("MaxSum sub array : ", tuple(A[left:right+1]))
    return (left, right)


# ==============================================================

# The maximum crossing subarray method for solving the max subarray problem
def find_maximum_crossing_subarray(A, low, mid, high):

    leftSum = A[mid]
    tempLeftSum = A[mid]
    i = mid - 1
    lIndex = mid
    while (i >= low):
        tempLeftSum = tempLeftSum + A[i]
        if (leftSum < tempLeftSum):
            leftSum = tempLeftSum
            lIndex = i
        i = i - 1

    rightSum = A[mid+1]
    tempRightSum = A[mid+1]
    i = mid + 2
    rIndex = i - 1
    while (i <= high):
        tempRightSum = tempRightSum + A[i]
        if (rightSum < tempRightSum):
            rightSum = tempRightSum
            rIndex = i
        i = i + 1
    return ((lIndex, rIndex), leftSum + rightSum)


# The recursive method to solve max subarray problem
def find_maximum_subarray_recursive_helper(A, low=0, high=-1):
    if (low == high):
        return ((low, high), A[low])
    else:
        midPoint = int((low + high)/2)

    leftArr = find_maximum_subarray_recursive_helper(A, low, midPoint)
    rightArr = find_maximum_subarray_recursive_helper(A, midPoint + 1, high)
    crossArr = find_maximum_crossing_subarray(A, low, midPoint, high)

    maxSum = max(leftArr[1], rightArr[1], crossArr[1])

    for i in (leftArr, rightArr, crossArr):
        if(i[1] == maxSum):
            return i


# The recursive method to solve max subarray problem
def find_maximum_subarray_recursive(A):
    output = find_maximum_subarray_recursive_helper(A, 0, len(A) - 1)
    print("\nfind_maximum_subarray_recursive output")
    print("start and end Index touple : ", output[0])
    print("max sum : ", output[1])
    print("max sub array : ", A[output[0][0]:output[0][1]+1])
    return output[0]

# ==============================================================


# The iterative method to solve max subarray problem
def find_maximum_subarray_iterative(A):

    maxSum = A[0]
    tempSum = 0
    left = 0
    right = 0
    index = 0
    i = 0
    while (i < len(A)):
        tempSum = tempSum + A[i]
        if (maxSum < tempSum):
            maxSum = tempSum
            left = index
            right = i
        if (tempSum < 0):
            tempSum = 0
            index = i + 1
        i = i + 1
    print("find_maximum_subarray_iterative output")
    print("left Index : ", left)
    print("right Index : ", right)
    print("maxSum : ", maxSum)
    print("MaxSum sub array : ", tuple(A[left:right+1]))

    return (left, right)

# =================================================================


def square_matrix_multiply(A, B):
    A = asarray(A)
    B = asarray(B)
    assert A.shape == B.shape
    assert A.shape == A.T.shape
    if (len(A) == 0 or len(B) == 0):
        return None
    w, h = len(A), len(A[0])
    Output = [[0 for x in range(w)] for y in range(h)]
    for i in range(len(A)):
        for j in range(len(B[0])):
            for k in range(len(B)):
                Output[i][j] += A[i][k] * B[k][j]
    print("matrix A :")
    print(A)
    print("matrix B : ")
    print(B)
    print("output : ")
    print(array(Output))
    return array(Output)


# ==============================================================

def add_matrix(A, B):
    length = len(A)
    result = [[0 for j in range(0, length)] for i in range(0, length)]
    for i in range(0, length):
        for j in range(0, length):
            result[i][j] = A[i][j] + B[i][j]
    return result


def substract_matrix(A, B):
    length = len(A)
    result = [[0 for j in range(0, length)] for i in range(0, length)]
    for i in range(0, length):
        for j in range(0, length):
            result[i][j] = A[i][j] - B[i][j]
    return result


def square_matrix_multiply_strassens(A, B):

    A = asarray(A)
    B = asarray(B)

    if len(A) == 0:
        return None

    assert A.shape == B.shape
    assert A.shape == A.T.shape

    if len(A) == 1:
        result = [0]
        result[0] = A[0]*B[0]
        return result

    assert (len(A) & (len(A) - 1)) == 0, "A is not a power of 2"
    length = len(A)
    newLen = int(length/2)

    A_top_left = [[0 for k in range(0, newLen)] for i in range(0, newLen)]
    A_top_right = [[0 for k in range(0, newLen)] for i in range(0, newLen)]
    A_bot_left = [[0 for k in range(0, newLen)] for i in range(0, newLen)]
    A_bot_right = [[0 for k in range(0, newLen)] for i in range(0, newLen)]
    B_top_left = [[0 for k in range(0, newLen)] for i in range(0, newLen)]
    B_top_right = [[0 for k in range(0, newLen)] for i in range(0, newLen)]
    B_bot_left = [[0 for k in range(0, newLen)] for i in range(0, newLen)]
    B_bot_right = [[0 for k in range(0, newLen)] for i in range(0, newLen)]

    for i in range(0, newLen):
        for j in range(0, newLen):
            A_top_left[i][j] = A[i][j]
            A_top_right[i][j] = A[i][j + newLen]
            A_bot_left[i][j] = A[i + newLen][j]
            A_bot_right[i][j] = A[i + newLen][j + newLen]
            B_top_left[i][j] = B[i][j]
            B_top_right[i][j] = B[i][j + newLen]
            B_bot_left[i][j] = B[i + newLen][j]
            B_bot_right[i][j] = B[i + newLen][j + newLen]

    expA = [[0 for k in range(0, newLen)] for i in range(0, newLen)]
    expB = [[0 for k in range(0, newLen)] for i in range(0, newLen)]

    expA = add_matrix(A_top_left, A_bot_right)
    expB = add_matrix(B_top_left, B_bot_right)
    m1 = square_matrix_multiply_strassens(expA, expB)

    expA = add_matrix(A_bot_left, A_bot_right)
    m2 = square_matrix_multiply_strassens(expA, B_top_left)

    expB = substract_matrix(B_top_right, B_bot_right)
    m3 = square_matrix_multiply_strassens(A_top_left, expB)

    expB = substract_matrix(B_bot_left, B_top_left)
    m4 = square_matrix_multiply_strassens(A_bot_right, expB)

    expA = add_matrix(A_top_left, A_top_right)
    m5 = square_matrix_multiply_strassens(expA, B_bot_right)

    expA = substract_matrix(A_bot_left, A_top_left)
    expB = add_matrix(B_top_left, B_top_right)
    m6 = square_matrix_multiply_strassens(expA, expB)

    expA = substract_matrix(A_top_right, A_bot_right)
    expB = add_matrix(B_bot_left, B_bot_right)
    m7 = square_matrix_multiply_strassens(expA, expB)

    expA = add_matrix(m1, m4)
    expB = add_matrix(expA, m7)
    r11 = substract_matrix(expB, m5)

    r12 = add_matrix(m3, m5)
    r21 = add_matrix(m2, m4)

    expB = add_matrix(add_matrix(m1, m3), m6)
    r22 = substract_matrix(expB, m2)

    Result = [[0 for k in range(0, length)] for i in range(0, length)]

    for i in range(0, newLen):
        for j in range(0, newLen):
            Result[i][j] = r11[i][j]
            Result[i][j + newLen] = r12[i][j]
            Result[i + newLen][j] = r21[i][j]
            Result[i + newLen][j + newLen] = r22[i][j]
    return array(Result)
    pass


# ==============================================================


def test():
    """
    find_maximum_subarray_brute(STOCK_PRICE_CHANGES)
    find_maximum_subarray_recursive(STOCK_PRICE_CHANGES)
    find_maximum_subarray_iterative(STOCK_PRICE_CHANGES)
    A = [[1, 2], [3, 4]]
    B = [[4, 3], [2, 1]]
    square_matrix_multiply(A, B)
    A = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]]
    print("\nA : ", A)
    B = [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]]
    print("B : ", B)
    print("\nresult : ")
    print(square_matrix_multiply(A, B))
    """
    pass


if __name__ == '__main__':

    test()

# ==============================================================
