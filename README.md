# Michał Muzyka 2.3 – Sprawozdanie Zadanie 2

### Poniższy zrzut ekranu prezentuje strukturę projektu. W folderze app znajduje się aplikacja zaimplementowana w stacku MEAN. Najważniejsze są w niej pliki Dockerfile, które będą służyć do zbudowania obrazów backendu i frontendu. Plik docker-compose.yaml nie jest tu używany.

### Istotny jest też plik index.js frameworka Express backendu, gdzie ustawiona jest trasa /health do sprawdzania poprawności backendu, a także gdzie ustawione są ścieżki endpointów /auth i /api. Warte uwagi są też pliki seed.js i seeder.js, które służą do wypłenienia bazy danych danymi za pomocą Joba podczas pierwszego uruchomienia aplikacji. 

### W pliku README.md w folderze app znajduje się krótki opis aplikacji.

### Pliki w folderze k8s są to pliki YAML do wdrożenia aplikacji do Kubernetesa. 

### Pliki YAML i Dockerfile są opisane komentarzami znajdującymi się w samych plikach.
![alt text](images/image-8.png)


### Aby wdrożyć aplikację, najpierw uruchamiam Minikube'a z wtyczka sieciową Calico i z użyciem Dockera. Włączam Ingress, ponieważ zostanie użyty w zadaniu.

![alt text](images/image-1.png)


### Przełączam się na Dockera wbudowanego w Minikube'a. W celu wdrożenia aplikacji najpierw tworzę obrazy backendu i frontendu zgodnie z ich plikami Dockerfile z tagiem v1. Alternatywą byłoby opublikowanie obrazów w rejestrach takich jak Docker Hub i pobranie ich.

![alt text](images/image.png)

![alt text](images/image-2.png)


### Aplikuję wszystkie utworzone pliki YAML. Pliki zostały utworzone. Ostrzeżenie o SessionAffinity jest normalne dla Headless Service i można go zignorować.

![alt text](images/image-3.png)


### Weryfikuję poprawność wdrożenia aplikacji. Jak widać na zrzucie ekranu. Są dwie działające repliki backendu i frontendu, seeder job, który zakończył swoje zadanie oraz pod bazy danych. Jeśli chodzi o serwisy, to istnieją serwisy dla backendu i frontendu na odpowednio portach 5000 i 4200. Service bazy danych w kolumnie CLUSTER-IP ma None, a więc poprawnie utworzył się Headless Service. Są dwa deploymenty dla backendu i frontendu oraz StatefulSet dla bazy. Działa Ingress na brilliantapp.zad, istnieją polityki sieciowe oraz secrety (3 wartości dla backendu i 2 dla bazy).


![alt text](images/image-4.png)



### Backend poprawnie przyjął wartości z secretów i config map.

![alt text](images/image-5.png)


### Baza danych również poprawnie przyjęła wartości z secretów. Jednak Secrety Opaque kodowane w Base64 nie są najlepszym rozwiązaniem. Dla produkcji lepiej trzymać je w Vault / External lub użyć SecretsSealed.

![alt text](images/image-33.png)

### Seeder poprawnie dodał dane inicjalizacyjne do bazy danych.

![alt text](images/image-6.png)


### Logi podów backendu i frontendu nie ukazują żadnych błędów sond np. HTTP 500 na /health.

![alt text](images/image-7.png)


### Zasoby zostały poprawnie przydzielone.

![alt text](images/image-9.png)


### Jak widać istnieją obiekty PVC i PV, które są ze sobą połączone (Bound), MongoDB ma 1 GB pojemności, a dane przetrwają restart poda, jednak po usunięciu PVC znikną. Jeśli chce się zachować dane, nalezy użyć reclaimPolicy: Retain.

![alt text](images/image-10.png)


### Aby dostać się na stronę w przegladarce na adresie http://brilliantapp.zad/ można np. dodać ten adres do pliku /etc/hosts, po uprzednim sprawdzeniu adresu IP Minikube'a.

![alt text](images/image-11.png)


### Wpisuję dodany adres w przeglądarce. Strona działa. Już można dostrzec, że posty dodane do bazy przez seedera zostały załadowane, co znaczy, że na pewno baza danych działa, a frontend pobrał te posty od backendu, który z kolei wcześniej pobrał je z bazy. Oznacza to, że wszystkie moduły wydają się działać poprawnie i ze sobą współpracować.

![alt text](images/image-12.png)


### Obsługa błędów rejestracji w backendzie działa.

![alt text](images/image-13.png)


### Logowanie użytkownika działa. Zatem baza danych zapisuje poprawnie dane logowania i rejestracji.

![alt text](images/image-14.png)

![alt text](images/image-15.png)


### Dodawanie opinii użytkownika działa. Po przetestowaniu tych dwóch funkcjonalności można więc stwierdzić, że ścieżki endpointów /api i /auth backendu działają poprawnie.

![alt text](images/image-16.png)

![alt text](images/image-17.png)


### Aby zaprezentować aktualizację aplikacji bez przerywania jej działania, zmieniam treść elementu <span> na frontendzie, dodając słowo "wędkarzy", a dla backendu dodaję ikonkę pudełka do wiadomości z logów.

![alt text](images/image-18.png)

![alt text](images/image-21.png)


### Buduję zaktualizowane wersje obrazów frontendu i backendu z tagami v2.

![alt text](images/image-22.png)

![alt text](images/image-23.png)

![alt text](images/image-26.png)


### W plikach YAML deploymentów backendu i frontendu zmieniam tagi nazwy obrazu z v1 na v2, aby zaczęły używać nowych obrazów.

![alt text](images/image-24.png)

![alt text](images/image-25.png)



### Aplikuję zmienione pliki YAML deploymentu

![alt text](images/image-32.png)


### Jak widać stare pody są stopniowo podmieniane na nowe. Dzięki maxUnavailable: 0 żaden pod nie zostanie usunięty dopóki nowy nie będzie gotowy. Kombinacja z maxSurge: 1 pozwala na tymczasowe zwiększenie liczby podów, co gwarantuje aktualizację aplikacji bez przerywania jej działania. W połączeniu z sondą readinessProbe Kubernetes upewnia się, że nowa wersja faktycznie działa przed skierowaniem do niej ruchu.

![alt text](images/image-29.png)

![alt text](images/image-27.png)

![alt text](images/image-28.png)


### Stan aplikacji przed aktualizacją:

![alt text](images/image-19.png)

![alt text](images/image-20.png)


### Stan aplikacji po aktualizacji. Aplikacja nadal działa i zmiany zostały zastosowane.

![alt text](images/image-30.png)

![alt text](images/image-31.png)

![alt text](images/image-36.png)

### W zadaniu zostały użyte sondy Liveness i Readiness dla Backendu i Readiness dla Frontendu. Służą do sprawdzania stanu kontenera uruchomionego w Podzie.

### Sonda Liveness sprawdza, czy aplikacja nadal działa. Jeśli aplikacja nie działa, Kubernetes restartuje kontener.

### Sonda Readiness sprawdza czy kontener jest w stanie obsługiwać ruch. Jeśli sonda zawiedzie, Pod nie dostaje ruchu z Service i nie jest restartowany.

### Pierwsza sonda Readiness Probe znajduje sie na frontendzie. Sonda ta weryfikuje, czy serwer Nginx poprawnie wystartował i serwuje pliki aplikacji (kod 200 na ścieżce /). Zastosowanie tej sondy jest kluczowe dla mechanizmu Zero Downtime Deployment. Podczas aktualizacji, Kubernetes nie skieruje ruchu do nowej repliki frontendu, dopóki ta sonda nie zwróci sukcesu. Zapobiega to sytuacji, w której użytkownik trafiłby na kontener, który jeszcze się nie uruchomił. Czas opóźnienia (5 s) jest krótki, ponieważ Nginx startuje bardzo szybko. Co 10 sekund wykonywane jest kolejne sprawdzenie. Ponieważ Nginx jest stabilny, readiness powinien wystarczyć na frontend.

![alt text](images/image-34.png)


### Pierwsza z sond backendu to Liveness Probe. Sonda ta weryfikuje, czy proces serwera Node.js jest uruchomiony i nasłuchuje na porcie sieciowym. Zapobiega zombie procesom i zawieszonym aplikacjom. Wybrano prosty test tcpSocket, ponieważ jest on lekki i wystarczający do stwierdzenia, czy proces nie uległ awarii, która uniemożliwiłaby nawiązanie połączenia. InitialDelaySeconds ustawiono na 30 sekund, aby dać aplikacji czas na start i uniknąć pętli restartów podczas inicjalizacji. Jeśli test się nie powiedzie 3 razy, Kubernetes zrestartuje kontener. Co 20 sekund wykonywane jest kolejne sprawdzenie. 

### Druga z sond backendu to Readiness Probe. Ta sonda sprawdza logiczną gotowość aplikacji do obsługi ruchu. Wykorzystano dedykowany endpoint /health, który weryfikuje status połączenia z bazą danych MongoDB (zwraca kod 200, jeśli mongoose.connection.readyState === 1, w przeciwnym razie 500). Sonda ta jest kluczowa dla stabilności systemu, ponieważ jeśli backend straci połączenie z bazą, Kubernetes przestanie kierować do niego ruch użytkowników, ale nie zrestartuje kontenera niepotrzebnie, dając mu szansę na ponowne nawiązanie połączenia. Sonda czeka 30 s na połączenie z bazą danych przez backend. Co 10 sekund wykonywane jest kolejne sprawdzenie gotowości. Po 3 nieudanych próbach pod będzie oznaczony jako niegotowy.

![alt text](images/image-35.png)