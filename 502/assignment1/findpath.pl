%Problem1
%Find a weight and path in weighted graph.

path(a,b,1).
path(a,c,6).
path(b,c,4).
path(b,d,3).
path(b,e,1).
path(c,d,1).
path(d,e,1).

%rule for the edge between two nodes.
adjacent(Source,Destination,Weight):-
	path(Source,Destination,Weight);
	path(Destination,Source,Weight).  


findpath(Source,Destination,Weight,Path):- 
	helperFunction(Source,Destination,[Source],Weight,Queue),
    reverse(Queue,Path).

%Basecase when theres are only two nodes.

helperFunction(Source,Destination,VisitedNodes,Weight,[Destination|VisitedNodes]):- 
	adjacent(Source,Destination,Weight).


helperFunction(Source,Destination,VisitedNodes,FinalWeight,Path):-
	adjacent(Source,MidNode,W1),
	MidNode \== Destination,
	not(member(MidNode,VisitedNodes)),
	helperFunction(MidNode,Destination,[MidNode|VisitedNodes],W2,Path),
	FinalWeight is W1 + W2.