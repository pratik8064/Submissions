

edge(1,2).
edge(1,3).
edge(1,4).
edge(1,6).
edge(2,3).
edge(2,5).
edge(3,4).
edge(3,5).
edge(3,6).
edge(3,5).
edge(3,6).

vertex(1).
vertex(2).
vertex(3).
vertex(4).
vertex(5).
vertex(6).

path(X,Y):-
	edge(X,Y);
	edge(Y,X).

color(red).
color(blue).
color(green).
color(yellow).

% very first time with one vertex and one color
color_map(L):-
	color(Color),
	vertex(Vertex),
	append([Vertex|[Color]],[],Row),
	RowNext = [Row],
	VertexNext is Vertex + 1 ,
	helperFunction(VertexNext,RowNext,L).
	
%helper function for coloring
helperFunction(Vertex,Row,L):-
	color(Color1),
	vertex(Vertex),
	check_for_conflict(Vertex,Color1,Row),
	append(Row,[Vertex,Color1],Row1),
	VertexNext is Vertex+1,
	helperFunction(VertexNext,Row1,L).

helperFunction(_,Row,L):-
	length(Row,N),
	N = 6,
	L = Row.

check_for_conflict(_,_,[]).

check_for_conflict(Vertex,Color,[[V|_]|T]):-
	\+(path(Vertex,V)),
	check_for_conflict(Vertex,Color,T).
	
check_for_conflict(Vertex,Color,[[V3|[ColorNext]]|T]):-
	path(Vertex,V3),
	Color \== ColorNext,
	check_for_conflict(Vertex,Color,T).

%helper function for length
lenList([],0).
lenList([_|Tail],Num):-
	lenList(Tail,Next),
	Next is Num + 1.
