FROM jacob9706/go-node-docker
WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Build the application and make executable
COPY . .
RUN go build -o ./main ./src/main.go
RUN chmod +x ./main

# Build the frontend
RUN npm --prefix ./frontend install ./frontend
RUN npm --prefix ./frontend run build

EXPOSE 8080

RUN wget -O /app/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
# Make db wait tool executable
RUN chmod +x /app/wait-for-it.sh
RUN apk add --no-cache bash

CMD /app/wait-for-it.sh ${POSTGRESS_ADDRESS} -- ./main