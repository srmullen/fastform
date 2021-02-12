<script lang="ts">
  import { useField } from '../src';
  import type { FormState } from '../src/types';

  export let form: FormState;

  const userName = useField({ name: 'userName' });
  const email = useField({ name: 'email' });
  const password = useField({ name: 'password' });
  const jobType = useField({ name: 'jobType' });
  const awesome = useField({ name: 'awesome', value: "awesome!" });
  const cool = useField({ name: 'awesome', value: 'cool' });
  const pizza = useField({ name: 'food', value: 'pizza' });
  const iceCream = useField({ name: 'food', value: 'ice cream' });
  const mynumber = useField({ name: 'mynumber' });
  const startDate = useField({ name: 'startDate' });
  const myrange = useField({ name: 'myrange' });
</script>

<div>
  <label for="userName">Username</label>
  <input 
    class="border-gray-900 border"
    id="userName" 
    data-testid="userName"
    type="text"
    use:userName.props
  />
</div>
<div>
  <label for="email">Email Address</label>
  <input 
    class="border border-gray-900"
    id="email"
    data-testid="email"
    type="email"
    use:email.props
  />
</div>
<div>
  <label for="password">Password</label>
  <input 
    class="border border-gray-900"
    id="password"
    data-testid="password"
    type="password" 
    use:password.props
  />
</div>
<div>
  <label for="jobType">Job Type</label>
  <select 
    id="jobType" 
    class="border border-gray-900"
    data-testid="jobType"
    use:jobType.props
  >
    <!-- <option value="">Choose</option>
    <option value="Designer">Designer</option>
    <option value="Developer">Developer</option>
    <option value="Product">Product</option>
    <option value="lazyBum">Lazy Bum</option> -->

    <option use:jobType.value={null}>Choose</option>
    <option use:jobType.value={{ title: "Designer" }}>Designer</option>
    <option use:jobType.value={{ title: "Developer" }}>Developer</option>
    <option use:jobType.value={{ title: "Product" }}>Product</option>
    <option use:jobType.value={"lazyBum"} data-testid="lazyBum">Lazy Bum</option>
  </select>
</div>
<div>
  <label class="block">
    <input 
      data-testid="awesomeCheckbox"
      type="checkbox" 
      use:awesome.props
    />
    <span>This is awesome!</span>
  </label>
  <label class="block">
    <input 
      data-testid="coolCheckbox"
      type="checkbox" 
      use:cool.props
    />
    <span>And it's cool!</span>
  </label>
</div>
<div>
  <label class="block">
    <input 
      data-testid="pizza"
      type="radio" 
      use:pizza.props
    />
    <span>Pizza</span>
  </label>
  <label class="block">
    <input 
      data-testid="iceCream"
      type="radio" 
      use:iceCream.props
    />
    <span>Ice Cream</span>
  </label>
</div>
<div>
  <label>Number Input</label>
  <input
    type="number"
    class="border border-gray-900"
    use:mynumber.props
  />
</div>
<div>
  <label for="startDate">Start Date</label>
  <input 
    type="date" 
    id="startDate"
    use:startDate.props
  />
</div>
<div>
  <label for="myrange">Range</label>
  <input
    type="range"
    min="10"
    max="40"
    use:myrange.props
  />
</div>
<button data-testid="submit-btn" class="bg-green-900 text-white py-2 px-4" type="submit">Submit</button>