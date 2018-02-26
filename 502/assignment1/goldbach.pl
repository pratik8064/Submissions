%Finding the pairs of prime number addition so result is even number

% base for prime
prime(2).
prime(3).
	
% predicate to check if number Num is prime number
% avoid even numbers and those with factors.
prime(Num) :-
	integer(Num),
	Num > 3,
	Num mod 2 =\= 0,
	\+ factor(Num,3).

% factor used while checking for prime
factor(Number,List) :-
	Number mod List =:= 0.

factor(Number,List) :-
	List * List < Number,
	L2 is List + 2,
	factor(Number,L2).

goldbach(Number,List) :-
	Number mod 2 =:= 0,
	Number > 4,
	goldbach(Number,List,3).

goldbach(Number,[CurrentNumber,N],CurrentNumber) :-
	N is Number - CurrentNumber,
	prime(N), CurrentNumber < N.

goldbach(Number,List,CurrentNumber) :-
	CurrentNumber < Number,
	getnext_prime(CurrentNumber,NextNumber),
	goldbach(Number,List,NextNumber).

%predicate to get next prime number
getnext_prime(CurrentNumber,NextNumber) :-
	NextNumber is CurrentNumber + 2,
	prime(NextNumber).

getnext_prime(CurrentNumber,NextNumber) :-
	P2 is CurrentNumber + 2,
	\+ prime(P2),
	getnext_prime(P2, NextNumber).

