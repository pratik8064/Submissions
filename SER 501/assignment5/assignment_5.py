# import numpy as np
# ============================== Counting Pond ================================

# from pylint.test.functional import return_outside_function


class Graph:
    def __init__(self, rows, coloumns, g):
        self.R = rows
        self.C = coloumns
        self.graph = g

    def checkAdj(self, i, j, isVisited):
        return (0 <= i < self.R and 0 <= j < self.C and
                not isVisited[i][j] and self.graph[i][j] == '#')

    def DFS(self, i, j, isVisited):

        isVisited[i][j] = True

        if self.checkAdj(i-1, j-1, isVisited):
            self.DFS(i-1, j-1, isVisited)
        if self.checkAdj(i-1, j, isVisited):
            self.DFS(i-1, j, isVisited)
        if self.checkAdj(i-1, j+1, isVisited):
            self.DFS(i-1, j+1, isVisited)
        if self.checkAdj(i, j-1, isVisited):
            self.DFS(i, j-1, isVisited)
        if self.checkAdj(i, j+1, isVisited):
            self.DFS(i, j+1, isVisited)
        if self.checkAdj(i+1, j-1, isVisited):
            self.DFS(i+1, j-1, isVisited)
        if self.checkAdj(i+1, j, isVisited):
            self.DFS(i+1, j, isVisited)
        if self.checkAdj(i+1, j+1, isVisited):
            self.DFS(i+1, j+1, isVisited)

    def countPonds(self):
        isVisited = [[False for j in range(self.C)] for i in range(self.R)]
        pondNum = 0
        for i in range(self.R):
            for j in range(self.C):
                if not isVisited[i][j] and self.graph[i][j] == '#':
                    self.DFS(i, j, isVisited)
                    pondNum += 1
        return pondNum


def count_ponds(G):
    x = len(G)
    y = len(G[0])
    g = Graph(x, y, G)
    res = g.countPonds()
    return res

# ======================== Longest Ordered Subsequence ========================


def longest_ordered_subsequence(l):
    n = len(l)
    dp = [1] * n
    if n == 0:
        return 0
    result = 1
    for i in range(1, n):
        for j in range(0, i):
            if l[i] > l[j] and dp[i] < dp[j] + 1:
                dp[i] = dp[j] + 1
                result = max(result, dp[i])
    return result

# =============================== Supermarket =================================


def getMaxVal(T, time, val, n):
    Val = [[0 for x in range(T + 1)] for x in range(n + 1)]

    for i in range(n + 1):
        for t in range(T + 1):
            if i == 0 or t == 0:
                Val[i][t] = 0
            elif time[i - 1] >= t:
                Val[i][t] = max(val[i - 1] + Val[i - 1][t - 1], Val[i - 1][t])
            else:
                Val[i][t] = Val[i][t - 1]

    return Val[n][T]


def supermarket(items):
    n = len(items)
    items.sort(key=lambda tup: tup[1])
    val = []
    time = []
    maxTime = 0
    for item in items:
        val.append(item[0])
        time.append((item[1]))
        maxTime = max(maxTime, item[1])
    return getMaxVal(maxTime, time, val, n)


# ============================== Reducibility =================================

def partition_set_solver(S):
    total = sum(S)

    if total & 1 == 1:
        return False

    total >>= 1
    n = len(S) + 1

    dp = [[False for i in range(total + 1)] for j in range(n)]

    for i in range(n):
        dp[i][0] = True

    for i in range(1, n):
        for j in range(1, total + 1):
            dp[i][j] = dp[i - 1][j]
            if j >= S[i - 1]:
                dp[i][j] = dp[i][j] or dp[i - 1][j - S[i - 1]]

    return dp[n - 1][total]


def subset_sum_solver(S, n):

    totalSum = sum(S)
    flag = True

    for item in S:
        if item != 0:
            flag = False
            break

    if n > totalSum:
        return False
    if flag and n == 0:
        return True
    if flag and n != 0:
        return False

    temp = []
    for i in range(len(S)):
        temp.append(S[i])

    temp.append(totalSum + n)
    temp.append((2 * totalSum) - n)

    if partition_set_solver(temp):
        return True
    else:
        return False

# =============================== Unit tests ==================================


def test_suite():

    arr = ["#--------##-",
           "-###-----###",
           "----##---##-",
           "---------##-",
           "---------#--",
           "--#------#--",
           "-#-#-----##-",
           "#-#-#-----#-",
           "-#-#------#-",
           "--#-------#-"]

    res = count_ponds(arr)
    print(res)
    if res == 3:
        print('passed')
    else:
        print('failed')

    arr = ["#--------##-",
           "-##------###",
           "---###------",
           "---#-----##-",
           "--##--------",
           "--#------#--",
           "-#-#-----##-",
           "#-#-#-----#-",
           "-#-#--------",
           "--#-------#-"]

    res = count_ponds(arr)
    print(res)
    if res == 5:
        print('passed')
    else:
        print('failed')

    arr = [1, 7, 3, 5, 9, 4, 8]
    print(arr)
    res = longest_ordered_subsequence(arr)
    print("ans : ", res)

    if res == 4:
        print('passed')
    else:
        print('failed')

    arr = [1, 1, 1, 1, 1, 1, 2, 1, 1]
    print(arr)
    res = longest_ordered_subsequence(arr)
    print("ans : ", res)

    if res == 2:
        print('passed')
    else:
        print('failed')
    arr = [(50, 2), (10, 1), (20, 2), (30, 1)]
    print(arr)
    res = supermarket(arr)
    print(res)
    if res == 80:
        print('passed')
    else:
        print('failed')

    arr = [(20, 1), (2, 1), (10, 3), (100, 2), (8, 2), (5, 20), (50, 10)]
    print(arr)
    res = supermarket(arr)
    print(res)
    if res == 185:
        print('passed')
    else:
        print('failed')

    arr = [(50, 3), (10, 3), (20, 2), (30, 2), (10, 1), (10, 10),
                    (10, 10), (10, 10)]
    print(arr)
    res = supermarket(arr)
    print(res)

    if res == 130:
        print('passed')
    else:
        print('failed')

    if subset_sum_solver([1, 3, 2, 4], 8) is True:
        print('passed')
    else:
        print('failed')


if __name__ == '__main__':
    test_suite()
