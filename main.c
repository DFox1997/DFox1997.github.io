#include <stdio.h>

void create_record();
void read_record();
void update_record();
void delete_record();

int main() {
    int choice;
    while(1) {
        printf("\nTech Stocks Database Management System\n");
        printf("1. Create Record\n");
        printf("2. Read Record\n");
        printf("3. Update Record\n");
        printf("4. Delete Record\n");
        printf("5. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch(choice) {
            case 1:
                create_record();
                break;
            case 2:
                read_record();
                break;
            case 3:
                update_record();
                break;
            case 4:
                delete_record();
                break;
            case 5:
                exit(0);
            default:
                printf("Invalid choice! Please enter again.\n");
        }
    }
    return 0;
}

void create_record() {
    FILE *file = fopen("stocks.txt", "a");
    char company[50];
    float price;
    printf("Enter company name: ");
    scanf("%s", company);
    printf("Enter stock price: ");
    scanf("%f", &price);
    fprintf(file, "%s %.2f\n", company, price);
    fclose(file);
    printf("Record created successfully.\n");
}

void read_record() {
    FILE *file = fopen("stocks.txt", "r");
    char company[50];
    float price;
    while(fscanf(file, "%s %f", company, &price) != EOF) {
        printf("Company: %s, Stock Price: $%.2f\n", company, price);
    }
    fclose(file);
}

void update_record() {
    FILE *file = fopen("stocks.txt", "r");
    FILE *temp = fopen("temp.txt", "w");

    char company[50], newCompany[50];
    float price, newPrice;
    int found = 0;

    printf("Enter company name to update: ");
    scanf("%s", company);

    while (fscanf(file, "%s %f", company, &price) != EOF) {
        if (strcmp(company, newCompany) == 0) {
            found = 1;
            printf("Enter new company name: ");
            scanf("%s", newCompany);
            printf("Enter new stock price: ");
            scanf("%f", &newPrice);
            fprintf(temp, "%s %.2f\n", newCompany, newPrice);
        } else {
            fprintf(temp, "%s %.2f\n", company, price);
        }
    }

    fclose(file);
    fclose(temp);

    remove("stocks.txt");
    rename("temp.txt", "stocks.txt");

    if (found) {
        printf("Record updated successfully.\n");
    } else {
        printf("Record not found.\n");
    }
}

void delete_record() {
    FILE *file = fopen("stocks.txt", "r");
    FILE *temp = fopen("temp.txt", "w");

    char company[50], companyToDelete[50];
    float price;
    int found = 0;

    printf("Enter company name to delete: ");
    scanf("%s", companyToDelete);

    while (fscanf(file, "%s %f", company, &price) != EOF) {
        if (strcmp(company, companyToDelete) != 0) {
            fprintf(temp, "%s %.2f\n", company, price);
        } else {
            found = 1;
        }
    }

    fclose(file);
    fclose(temp);

    remove("stocks.txt");
    rename("temp.txt", "stocks.txt");

    if (found) {
        printf("Record deleted successfully.\n");
    } else {
        printf("Record not found.\n");
    }
}
