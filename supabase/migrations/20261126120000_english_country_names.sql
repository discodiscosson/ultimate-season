-- Country names are now stored in English (Swedish names are kept as aliases).
alter table ultimate_season.countries rename column name_sv to name;
