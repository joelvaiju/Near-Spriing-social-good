
// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, setup_alloc};
use near_sdk::collections::{LookupMap, TreeMap};
use near_sdk::AccountId;

pub const UNIT_PRICE : u128 = 1;
pub const TIKETS_PER_UNIT :u128 = 7;

setup_alloc!();





#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    
    tickets_per_owner: LookupMap<AccountId, u128>,
    snake_game_stats: TreeMap<AccountId, u128>,


}

impl Default for Contract {
  fn default() -> Self {
    Self {
        tickets_per_owner: LookupMap::new(b"a".to_vec()),
        snake_game_stats: TreeMap::new(b"s".to_vec()),
    }
  }
}

#[near_bindgen]
impl Contract {

    #[payable]
    pub fn buy_tickets(&mut self) {
        let account_id = env::signer_account_id();
        let deposit = env::attached_deposit()/1000000000000000000000000;
        let tickets = (deposit/UNIT_PRICE)*TIKETS_PER_UNIT;
        // Use env::log to record logs permanently to the blockchain!
       

       if self.tickets_per_owner.contains_key(&account_id) 
       {
        self.tickets_per_owner.insert(&account_id, &(self.tickets_per_owner.get(&account_id).unwrap()+&tickets));
       }
       else
       {
        self.tickets_per_owner.insert(&account_id, &tickets);
       }

       env::log(format!("{} got {} tickets for {} near", account_id, self.tickets_per_owner.get(&account_id).unwrap(), self.tickets_per_owner.contains_key(&account_id) ).as_bytes());

       
       
    }

    pub fn update_snake_game_stats(&mut self, score : u128, account_id :String){

        if self.snake_game_stats.contains_key(&account_id) {
            let old_score : u128 =  self.snake_game_stats.get(&account_id).unwrap();
            let max_score : u128 = if old_score > score {old_score}  else {score};
            self.snake_game_stats.insert(&account_id, &max_score);
        }else{
            self.snake_game_stats.insert(&account_id, &score);
        }

       if self.tickets_per_owner.get(&account_id).unwrap() > 0 {
        self.tickets_per_owner.insert(&account_id, &(self.tickets_per_owner.get(&account_id).unwrap()-1));
       }

    }


    
    pub fn get_ticket_per_user(&self, account_id: String) -> u128 {
        match self.tickets_per_owner.get(&account_id) {
            Some(tickets) => tickets,
            None => 0,
        }
    } 

    
}
