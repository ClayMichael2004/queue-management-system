# Queue Management System

A bank-style queue management and appointment booking system with SMS notifications and printable receipts.


# Queue Management System

## Overview
A bank-style queue management and appointment booking system that assigns customers queue numbers and service tills, sends SMS notifications, and provides printable receipts.

## Services
- Account Services (A)
- Deposits & Withdrawals (D)
- Loans (L)
- Customer Care (C)

## Tills Mapping
| Till | Service |
|-----|---------|
| 1 | Account Services |
| 2 | Deposits |
| 3 | Loans |
| 4 | Customer Care |

## Queue Number Format
[SERVICE CODE][3-digit number]  
Example: A001, D002

Queue numbers reset daily per service.

## Queue Status Flow
WAITING → SERVING → COMPLETED

## Key Features
- Queue booking
- Automatic till assignment
- Printable receipt
- SMS notifications
- Admin & cashier dashboards


## Database Design

### Tables
- services
- tills
- customers
- queues
- users

### Queue Status
WAITING → SERVING → COMPLETED

### Relationships
- One service has many queues
- One till handles one service
- One customer can have multiple queue entries
