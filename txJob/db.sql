-- initial schema to store and index transactions  

create table transactions (
	id serial primary key not null,
	tx_id text not null,
	data jsonb not null,
	to_address text not null,
	from_address text not null
);

create table last_synced_block (block_number int);

insert into
	last_synced_block(block_number)
values
	(-1);

create index transactions_from_idx on transactions(from_address);

create index transactions_to_idx on transactions(to_address);
