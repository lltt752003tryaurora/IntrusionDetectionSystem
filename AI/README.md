# Network_IDS

```sh
git clone https://github.com/phanhoang1803/Network_IDS
cd Network_IDS/DetectorModels/src
```

## Usage
### To train neural network, below arguments are required. For more details and more arguments, please refer to Training parameters (NN-specific) in utils/utils.py 
```sh
python train.py \
    --data_dir "path/to/data/dir" \
```

### To train LightGBM, below arguments are required. For more details and more arguments, please refer to LightGBM parameters in utils/utils.py
```sh
python train_lgbm.py \
    --data_dir "path/to/data/dir" \
```

### To run application.
```sh
cd Network_IDS/app
python run.py
```
